import * as React from "react";
import * as R from "ramda";
import memoize from "memoize-one";
import { Observable, Subscription } from "rxjs";

import { BaseComponent, BaseState } from "./BaseComponent";
import { Component } from "./Component";
import { ComponentListLogs } from "./logging/ComponentListLogs";
export { ComponentListLogs };
import { Logging } from "./Logging";
import { LoggingConfig, DefaultLoggingConfig } from "./configs/LoggingConfig";
import { Protocol } from "./Protocol";
import { ProtocolConfig } from "./configs/ProtocolConfig";

// Extract the derived component's template parameters
export type CProps<Comp>  = Comp extends Component<infer Props, infer Entity, infer Data, infer Code> ? Props : undefined;
export type CEntity<Comp> = Comp extends Component<infer Props, infer Entity, infer Data, infer Code> ? Entity : undefined;
export type CData<Comp>   = Comp extends Component<infer Props, infer Entity, infer Data, infer Code> ? Data : undefined;
export type CCode<Comp>   = Comp extends Component<infer Props, infer Entity, infer Data, infer Code> ? Code : undefined;

interface State<Entity> extends BaseState {
  entities: Entity[];

  // Diagnostics for the component
  logs: ComponentListLogs
  loggingConfig: LoggingConfig;
}

export abstract class ComponentList<
  Props,
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
  protected abstract createObservableEntities(props: Props, protocol: ProtocolConfig): Observable<Entity[]>;
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
      logs: new ComponentListLogs(),
      loggingConfig: DefaultLoggingConfig,
      inferredProps: {}
    };

    this.onQueryEntities = this.onQueryEntities.bind(this);
    this.onQueryError = this.onQueryError.bind(this);
    this.onQueryComplete = this.onQueryComplete.bind(this);
  }

  public render() {
    const children = this.props.children;
    const { entities, protocolConfig, logs, loggingConfig } = this.state;

    // merge our component inferred props into the normal props
    const props = this.mergeInferredProps();

    // TODO: better logging when props are missing
    this.observableEntities(props, protocolConfig);

    logs.reactRendered(loggingConfig);

    // TODO: should `if (config)` be there?
    return (
      <>
      <Protocol.Config>
        {config => () => { if (config) this.mergeState({ protocolConfig: config }) }}
      </Protocol.Config>
      <Logging.Config>
        {config => () => { if (config) this.mergeState({ loggingConfig: config }) }}
      </Logging.Config>
      {() => this.gatherInferredProps()}
      {() => {
        if (typeof children === "function") {
          return children(entities);
        } else {
          // TODO: better loading handler
          entities ? entities.map(entity => (
            <>
            {this.renderComponent(entity, children)}
            </>
          )) : <div>loading...</div>
        }
      }}
      </>
    )
  }

  public componentWillUnmount() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = undefined;
    }
  }

  private createObservableEntitiesWithProps(props: Props, protocol: ProtocolConfig | undefined): Observable<Entity[]> | undefined {
    const { logs, loggingConfig } = this.state;

    if (!protocol) {
      // TODO: logs.protocolConfigMissing()
      return undefined;
    }

    logs.entityCreated(loggingConfig);

    this.clearPrevState();

    try {
      const entities = this.createObservableEntities(props, protocol);

      logs.dataQueryStarted(loggingConfig);

      this._subscription = entities.subscribe(
        this.onQueryEntities,
        this.onQueryError,
        this.onQueryComplete
      );

      return entities;
    } catch (error) {
      logs.entityCreationFailed(loggingConfig, error);
      return undefined;
    }
  }

  private clearPrevState() {
    this.mergeState({
      entities: undefined
    });
  }

  private onQueryEntities(entities: Entity[]) {
    const { logs, loggingConfig } = this.state;

    logs.dataQueryReceivedData(loggingConfig);

    this.mergeState({
      entities: entities
    })
  }

  private onQueryError(error: Error) {
    const { logs, loggingConfig } = this.state;
    logs.dataQueryFailed(loggingConfig, error);
  }

  private onQueryComplete() {
    const { logs, loggingConfig } = this.state;
    logs.dataQueryCompleted(loggingConfig);
  }
}
