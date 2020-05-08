import * as React from "react";
import memoize from "memoize-one";
import { Observable, Subscription } from "rxjs";

// TODO: This should not be opinionated to arc
import { Entity as ArcEntity } from "@dorgtech/arc.js";

import { Component } from "./Component";
import { ComponentListLogs } from "./logging/ComponentListLogs";
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

// Helper type for the <entity, data> tuple used by the sort function
export type EntityList<Entity, Data> = Array<{ entity: Entity; data: Data }>;

// Extract the filter options type from the derived component's props
type PFilterOptions<Props> = Props extends ComponentListProps<
  infer Entity,
  infer Data,
  infer FilterOptions
>
  ? FilterOptions
  : undefined;

export interface ComponentListProps<Entity, Data, FilterOptions> {
  filter?: FilterOptions;
  sort?: (entities: EntityList<Entity, Data>) => EntityList<Entity, Data>;
}

interface State<Entity, Data> {
  entities: Entity[];
  sorted: EntityList<Entity, Data>;

  // Diagnostics for the component
  logs: ComponentListLogs;
}

export abstract class ComponentList<
  Props extends ComponentListProps<Entity, Data, PFilterOptions<Props>>,
  // @ts-ignore: This should always work
  Comp extends Component<CProps<Comp>, CEntity<Comp>, CData<Comp>>,
  Entity extends ArcEntity<CData<Comp>> = CEntity<Comp>,
  Data = CData<Comp>
> extends React.Component<Props, State<Entity, Data>> {
  protected abstract createObservableEntities(): Observable<Entity[]>;
  protected abstract renderComponent(
    entity: Entity,
    children: any,
    index: number
  ): React.ComponentElement<CProps<Comp>, any>;

  // See here for more information on the React.Context pattern:
  // https://reactjs.org/docs/context.html
  protected static _EntitiesContext: React.Context<any[] | undefined>;
  protected static _LogsContext: React.Context<ComponentListLogs | undefined>;

  private observableEntities = memoize(
    // This will only run when the function's arguments have changed :D
    // allowing us to only recreated/refetch the entity data when the props or arc context have changed.
    // See: https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization
    this.createObservableEntitiesWithProps
  );

  // Our graphql query's subscriber object
  private _subscription?: Subscription;

  private _entities: Observable<Entity[]> | undefined;

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
    const EntitiesProvider = this.constructor._EntitiesContext.Provider as any;
    const LogsProvider = this.constructor._LogsContext.Provider;

    const { children } = this.props;
    const { entities: unsorted, sorted, logs } = this.state;
    let entities = unsorted;

    if (sorted.length > 0) {
      entities = sorted.map((item) => item.entity);
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
      if (!this._entities) {
        this._entities = this.createObservableEntities();

        logs.dataQueryStarted();

        this._subscription = this._entities.subscribe(
          this.onQueryEntities,
          this.onQueryError,
          this.onQueryComplete
        );
      }

      return this._entities;
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

  private fetchData(entity: Entity): Promise<Data> {
    return new Promise((resolve, reject) => {
      const state = entity.state({});
      state.subscribe(
        (data: Data) => resolve(data),
        (error: Error) => reject(error)
      );
    });
  }

  private async onQueryEntities(entities: Entity[]) {
    const { logs } = this.state;
    const { sort } = this.props;
    logs.dataQueryReceivedData();

    try {
      if (sort) {
        const unsorted = entities.map(async (entity) => {
          const data = await this.fetchData(entity);
          return { entity, data };
        });
        Promise.all(unsorted).then((unsorted) => {
          this.setState({
            entities: entities,
            sorted: sort(unsorted),
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
