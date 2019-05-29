import * as React from "react";
import memoize from "memoize-one";
import { Observable, Subscription } from "rxjs";

import { BaseProps, BaseComponent } from "./BaseComponent";
import { Component } from "./Component";
import { ComponentListLogs } from "./logging/ComponentListLogs";
import LoadingView from './LoadingView';
//const R = require('ramda')
export { ComponentListLogs };

// Extract the derived component's template parameters
export type CProps<Comp>   = Comp extends Component<infer Props, infer Entity, infer Data, infer Code> ? Props : undefined;
export type CEntity<Comp>  = Comp extends Component<infer Props, infer Entity, infer Data, infer Code> ? Entity : undefined;
export type CData<Comp>    = Comp extends Component<infer Props, infer Entity, infer Data, infer Code> ? Data : undefined;
export type CCode<Comp>    = Comp extends Component<infer Props, infer Entity, infer Data, infer Code> ? Code : undefined;

interface State<Entity> {
  entities: Entity[];
  sorted: Array<any>;

  // Diagnostics for the component
  // TODO: logs aren't consumable, expose through a context?
  logs: ComponentListLogs
}

export abstract class ComponentList<
  Props extends BaseProps,
  Comp extends Component<
    CProps<Comp>,
    CEntity<Comp>,
    CData<Comp>,
    CCode<Comp>
  >,
  Entity = CEntity<Comp>
> extends BaseComponent<
    Props, State<Entity>
  >
{
  protected abstract createObservableEntities(): Observable<Entity[]>;
  protected abstract renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Comp>, any>;
  protected abstract fetchData(entity: Entity) : Promise<any>;

  private observableEntities = memoize(
    // This will only run when the function's arguments have changed :D
    // allowing us to only recreated/refetch the entity data when the props or arc context have changed.
    // See: https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization
    this.createObservableEntitiesWithProps
  );

  // Our graphql query's subscriber object
  private _subscription?: Subscription

  constructor(props: Props) {
    super(props);

    this.state = {
      entities: [],
      sorted: [],
      logs: new ComponentListLogs()
    };

    this.onQueryEntities = this.onQueryEntities.bind(this);
    this.onQueryError = this.onQueryError.bind(this);
    this.onQueryComplete = this.onQueryComplete.bind(this);
    //this.fetchData = this.fetchData.bind(this);
  }

  public render() {
    const { children } = this.props;
    const { entities, sorted, logs } = this.state;
    this.observableEntities(this.props);

    logs.reactRendered();

    if (typeof children === "function") {
      return children(entities);
    } else {
      // TODO: better loading handler
      if(entities) {
        if(sorted.length > 0)
          return sorted.map((item) => this.renderComponent(item.entity, children)) 
        else
          return entities.map((entity) => this.renderComponent(entity, children))
      } else
        return <LoadingView logs={logs}/>
    }
  }

  public async componentWillMount() {
    // prefetch the entities
    this.observableEntities(this.props);
  }

  public componentWillUnmount() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = undefined;
    }
  }

  private createObservableEntitiesWithProps(props: Props): Observable<Entity[]> | undefined {
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
    this.mergeState({
      entities: undefined
    });
  }

  private async onQueryEntities(entities: Entity[]) {
    const { logs } = this.state;
    // @ts-ignore
    const { sort } = this.props;
    logs.dataQueryReceivedData();

    if (sort) {
      const unsorted = entities.map(async (entity) => {
        let data = await this.fetchData(entity)
        return ({ entity: entity, data: data })
      })
      Promise.all(unsorted).then(unsorted => {
        this.mergeState({
          entities: entities,
          sorted: sort(unsorted)
        })
      })
    } else {
      this.mergeState({
        entities: entities,
      })
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
