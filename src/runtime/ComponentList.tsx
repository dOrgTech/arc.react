import * as React from "react";
import * as R from "ramda";
import memoize from "memoize-one";
import { Observable, Subscription } from "rxjs";

import { BaseProps } from "./BaseComponent";
import { Component } from "./Component";
import { ComponentListLogs } from "./logging/ComponentListLogs";
export { ComponentListLogs };
import { LoggingConfig, DefaultLoggingConfig } from "./configs/LoggingConfig";

// Extract the derived component's template parameters
export type CProps<Comp>  = Comp extends Component<infer Props, infer Entity, infer Data, infer Code> ? Props : undefined;
export type CEntity<Comp> = Comp extends Component<infer Props, infer Entity, infer Data, infer Code> ? Entity : undefined;
export type CData<Comp>   = Comp extends Component<infer Props, infer Entity, infer Data, infer Code> ? Data : undefined;
export type CCode<Comp>   = Comp extends Component<infer Props, infer Entity, infer Data, infer Code> ? Code : undefined;

interface State<Entity> {
  entities: Entity[];

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
> extends React.Component<
    Props, State<Entity>
  >
{
  protected abstract createObservableEntities(): Observable<Entity[]>;
  protected abstract renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Comp>, any>;

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
      logs: new ComponentListLogs()
    };

    this.onQueryEntities = this.onQueryEntities.bind(this);
    this.onQueryError = this.onQueryError.bind(this);
    this.onQueryComplete = this.onQueryComplete.bind(this);
  }

  public render() {
    const children = this.props.children;
    const { entities, logs } = this.state;
    this.observableEntities(this.props);

    logs.reactRendered(this.LoggingConfig);

    if (typeof children === "function") {
      return children(entities);
    } else {
      // TODO: better loading handler
      return entities ? entities.map(entity => (
        <>
        {this.renderComponent(entity, children)}
        </>
      )) : <div>loading...</div>
    }
  }

  public componentWillMount() {
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

    logs.entityCreated(this.LoggingConfig);

    this.clearPrevState();

    try {
      const entities = this.createObservableEntities();

      logs.dataQueryStarted(this.LoggingConfig);

      this._subscription = entities.subscribe(
        this.onQueryEntities,
        this.onQueryError,
        this.onQueryComplete
      );

      return entities;
    } catch (error) {
      logs.entityCreationFailed(this.LoggingConfig, error);
      return undefined;
    }
  }

  private clearPrevState() {
    this.mergeState({
      entities: undefined
    });
  }

  private onQueryEntities(entities: Entity[]) {
    const { logs } = this.state;

    logs.dataQueryReceivedData(this.LoggingConfig);

    this.mergeState({
      entities: entities
    });
  }

  private onQueryError(error: Error) {
    const { logs } = this.state;
    logs.dataQueryFailed(this.LoggingConfig, error);
  }

  private onQueryComplete() {
    const { logs } = this.state;
    logs.dataQueryCompleted(this.LoggingConfig);
  }

  private mergeState(merge: any, callback: (()=>void) | undefined = undefined) {
    this.setState(
      R.mergeDeepRight(this.state, merge),
      callback
    );
  }

  private get LoggingConfig(): LoggingConfig {
    if (this.props.loggingConfig) {
      return this.props.loggingConfig as any;
    } else {
      return DefaultLoggingConfig;
    }
  }
}
