import * as React from "react";
import memoize from "memoize-one";
import { Observable, Subscription } from "rxjs";

// TODO: This should not be opinionated to arc
import { Entity as StatefulEntity } from "@dorgtech/arc.js";

import { Component } from "./Component";
import { ComponentListLogs } from "./logging/ComponentListLogs";
import { MaybeAsync, executeMaybeAsyncFunction } from "./utils/async";
import LoadingView from "./LoadingView";
export { ComponentListLogs };

// Extract the derived component's template parameters
export type CProps<Comp> = Comp extends Component<
  infer Props,
  infer Entity,
  infer Data
>
  ? Props
  : undefined;
export type CEntity<Comp> = Comp extends Component<
  infer Props,
  infer Entity,
  infer Data
>
  ? Entity
  : undefined;
export type CData<Comp> = Comp extends Component<
  infer Props,
  infer Entity,
  infer Data
>
  ? Data
  : undefined;

// Extract the filter options type from the derived component's props
type PFilterOptions<Props> = Props extends ComponentListProps<
  infer Entity,
  infer FilterOptions
>
  ? FilterOptions
  : undefined;

export interface ComponentListProps<Entity, FilterOptions> {
  filter?: FilterOptions;
  sort?: (entities: Entity[]) => MaybeAsync<Entity[]>;
}

interface State<Entity> {
  entities: Entity[];
  sorted: Entity[];

  // Diagnostics for the component
  logs: ComponentListLogs;
}

export abstract class ComponentList<
  Props extends ComponentListProps<Entity, PFilterOptions<Props>>,
  // @ts-ignore: This should always work
  Comp extends Component<CProps<Comp>, CEntity<Comp>, CData<Comp>>,
  Entity extends StatefulEntity<CData<Comp>> = CEntity<Comp>
> extends React.Component<Props, State<Entity>> {
  protected abstract createObservableEntities(): Observable<Entity[]>;
  protected abstract renderComponent(
    entity: Entity,
    children: any,
    index: number
  ): React.ComponentElement<CProps<Comp>, any>;

  // See here for more information on the React.Context pattern:
  // https://reactjs.org/docs/context.html
  protected static EntitiesContext: React.Context<any[] | undefined>;
  protected static LogsContext: React.Context<ComponentListLogs | undefined>;

  private observableEntities = memoize(
    // This will only run when the function's arguments have changed :D
    // allowing us to only recreated/refetch the entity data when the props or arc context have changed.
    // See: https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization
    this.createObservableEntitiesWithProps
  );

  // Our graphql query's subscriber object
  private _subscription?: Subscription;

  // This trick allows us to access the static objects
  // defined in the derived class. See this code sample:
  // https://github.com/Microsoft/TypeScript/issues/5989#issuecomment-163066313
  // @ts-ignore: This should always be there
  "constructor": typeof ComponentList;

  constructor(props: Props) {
    super(props);

    this.state = {
      entities: [],
      sorted: [],
      logs: new ComponentListLogs(),
    };

    this.onQueryEntities = this.onQueryEntities.bind(this);
    this.onQueryError = this.onQueryError.bind(this);
    this.onQueryComplete = this.onQueryComplete.bind(this);
  }

  public render() {
    const EntitiesProvider = this.constructor.EntitiesContext.Provider as any;
    const LogsProvider = this.constructor.LogsContext.Provider;

    const { children } = this.props;
    const { entities: unsorted, sorted, logs } = this.state;
    let entities = unsorted;

    if (sorted.length > 0) {
      entities = sorted;
    }

    this.observableEntities(this.props);
    logs.reactRendered();
    return (
      <EntitiesProvider value={entities}>
        <LogsProvider value={logs}>
          {typeof children === "function" ? (
            children(entities)
          ) : entities.length ? (
            entities.map((entity, index) =>
              this.renderComponent(entity, children, index)
            )
          ) : (
            <LoadingView logs={logs} />
          )}
        </LogsProvider>
      </EntitiesProvider>
    );
  }

  public async UNSAFE_componentWillMount() {
    // prefetch the entities
    this.observableEntities(this.props);
  }

  public componentWillUnmount() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = undefined;
    }
  }

  private createObservableEntitiesWithProps(
    props: Props
  ): Observable<Entity[]> | undefined {
    const { logs } = this.state;

    logs.entityCreated();

    this.clearPrevState();

    try {
      if (this._subscription) {
        this._subscription.unsubscribe();
      }

      const entities = this.createObservableEntities();

      logs.dataQueryStarted();

      this._subscription = entities.subscribe(
        this.onQueryEntities,
        this.onQueryError,
        this.onQueryComplete
      );

      return entities;
    } catch (e) {
      logs.entityCreationFailed(e);
      this.setState({
        logs: logs.clone(),
      });
      return undefined;
    }
  }

  private clearPrevState() {
    this.setState({
      entities: [],
    });
  }

  private async onQueryEntities(entities: Entity[]) {
    const { logs } = this.state;
    const { sort } = this.props;
    logs.dataQueryReceivedData();

    try {
      if (sort) {
        const unsorted = entities.map(async (entity) =>
          entity.fetchState().then(() => entity)
        );
        await Promise.all(unsorted).then(async (unsorted) => {
          const sorted = await executeMaybeAsyncFunction(
            // TODO: unsure why typescript doesn't like `sort`...
            sort as (entities: Entity[]) => MaybeAsync<Entity[]>,
            unsorted
          );
          this.setState({
            entities: entities,
            sorted,
          });
        });
      } else {
        this.setState({
          entities: entities,
        });
      }
    } catch (e) {
      logs.dataQueryFailed(e);
      this.setState({
        logs: logs.clone(),
      });
    }
  }

  private onQueryError(error: Error) {
    const { logs } = this.state;
    logs.dataQueryFailed(error);
    this.setState({
      logs: logs.clone(),
    });
  }

  private onQueryComplete() {
    const { logs } = this.state;
    logs.dataQueryCompleted();
  }
}

export function createFilterFromScope<Scopes extends keyof any>(
  filter: any,
  scope: Scopes | undefined,
  scopeProps: Record<Scopes, string>,
  props: any
): any {
  if (scope) {
    if (!props[scopeProps[scope]]) {
      throw Error(
        `${
          props[scopeProps[scope]]
        } Missing: Please provide this field as a prop, or use the inference component.`
      );
    }
  }

  let f = filter;
  const keys = Object.keys(scopeProps);

  for (const key of keys) {
    const propName = scopeProps[key];
    if (props[propName]) {
      f = f ? f : { where: {} };
      if (!f.where) {
        f.where = {};
      }

      f.where[propName] = props[propName];
    }
  }

  return f;
}
