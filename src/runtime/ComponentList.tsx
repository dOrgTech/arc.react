import * as React from "react";
import memoize from "memoize-one";
import { Observable, Subscription } from "rxjs";
import { IStateful } from "@daostack/client/src/types";

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
  // TODO: logs aren't consumable, expose through a context?
  logs: ComponentListLogs;
}

export abstract class ComponentList<
  Props extends ComponentListProps<Entity, Data, PFilterOptions<Props>>,
  // @ts-ignore: This should always work
  Comp extends Component<CProps<Comp>, CEntity<Comp>, CData<Comp>>,
  Entity extends IStateful<CData<Comp>> = CEntity<Comp>,
  Data = CData<Comp>
> extends React.Component<Props, State<Entity, Data>> {
  protected abstract createObservableEntities(): Observable<Entity[]>;
  protected abstract renderComponent(
    entity: Entity,
    children: any
  ): React.ComponentElement<CProps<Comp>, any>;

  private observableEntities = memoize(
    // This will only run when the function's arguments have changed :D
    // allowing us to only recreated/refetch the entity data when the props or arc context have changed.
    // See: https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization
    this.createObservableEntitiesWithProps
  );

  // Our graphql query's subscriber object
  private _subscription?: Subscription;

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
    const { children } = this.props;
    const { entities, sorted, logs } = this.state;
    this.observableEntities(this.props);

    logs.reactRendered();

    if (typeof children === "function") {
      return children(entities);
    } else {
      if (entities) {
        if (sorted.length > 0)
          return sorted.map((item) =>
            this.renderComponent(item.entity, children)
          );
        else
          return entities.map((entity) =>
            this.renderComponent(entity, children)
          );
      } else return <LoadingView logs={logs} />;
    }
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
      const entities = this.createObservableEntities();

      logs.dataQueryStarted();

      this._subscription = entities.subscribe(
        this.onQueryEntities,
        this.onQueryError,
        this.onQueryComplete
      );

      return entities;
    } catch (error) {
      logs.entityCreationFailed(error);
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
  }

  private onQueryError(error: Error) {
    const { logs } = this.state;
    logs.dataQueryFailed(error);
  }

  private onQueryComplete() {
    const { logs } = this.state;
    logs.dataQueryCompleted();
  }
}
