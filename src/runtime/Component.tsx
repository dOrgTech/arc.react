import * as React from "react";
import { Context } from "react";
import memoize from "memoize-one";
import { Subscription } from "rxjs";
import { IStateful } from "@daostack/client/src/types"

import { BaseComponent, BaseState } from "./BaseComponent";
import { ComponentLogs } from "./logging/ComponentLogs";
export { ComponentLogs };
import { Logging } from "./Logging";
import { LoggingConfig, DefaultLoggingConfig } from "./configs/LoggingConfig";
import { Protocol } from "./Protocol";
import { ProtocolConfig } from "./configs/ProtocolConfig";

interface State<Data, Code> extends BaseState {
  // Context Feeds
  data?: Data;
  code?: Code;
  // TODO: Prose

  // Diagnostics for the component
  logs: ComponentLogs;
  loggingConfig: LoggingConfig;
}

export abstract class Component<
  Props,
  Entity extends IStateful<Data>,
  Data,
  Code
> extends BaseComponent<
    Props, State<Data, Code>
  >
{
  // Create the entity this component represents. This entity gives access
  // to the component's code, prose, and data. For example: DAO, Proposal, Member.
  // Note: This entity is not within the component's state, but instead a memoized
  // property that will be recreated whenever necessary. See `private entity` below...
  protected abstract createEntity(props: Props, protocol: ProtocolConfig): Entity;

  // See here for more information on the React.Context pattern:
  // https://reactjs.org/docs/context.html
  public static EntityContext<Entity>(): Context<Entity> {
    return Component._EntityContext as any;
  }

  public static DataContext<Data>(): Context<Data> {
    return Component._DataContext as any;
  }

  public static CodeContext<Code>(): Context<Code> {
    return Component._CodeContext as any;
  }

  public static LogsContext(): Context<ComponentLogs> {
    return Component._LogsContext as any;
  }

  // Untemplatized static context objects
  private static _EntityContext = React.createContext({ });
  private static _DataContext   = React.createContext({ });
  private static _CodeContext   = React.createContext({ });
  private static _LogsContext   = React.createContext({ });

  private entity = memoize(
    // This will only run when the function's arguments have changed :D
    // allowing us to only recreated/refetch the entity data when the props or arc context have changed.
    // See: https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization
    this.createEntityWithProps
  );

  // Our graphql query's subscriber object
  private _subscription?: Subscription;

  constructor(props: Props) {
    super(props);

    this.state = {
      logs: new ComponentLogs(),
      loggingConfig: DefaultLoggingConfig,
      inferredProps: {}
    };

    this.onQueryData = this.onQueryData.bind(this);
    this.onQueryError = this.onQueryError.bind(this);
    this.onQueryComplete = this.onQueryComplete.bind(this);
  }

  public render() {
    const EntityProvider = Component.EntityContext<Entity>().Provider as any;
    const DataProvider   = Component.DataContext<Data>().Provider as any;
    const CodeProvider   = Component.CodeContext<Code>().Provider as any;
    const LogsProvider   = Component.LogsContext().Provider;

    const children = this.props.children;
    const { data, code, protocolConfig, logs, loggingConfig } = this.state;

    // merge our component inferred props into the normal props
    const props = this.mergeInferredProps();

    // create & fetch the entity
    // TODO: this should throw errors. Upon first error, logging marks "loading started"
    // then when first success is seen, record that time too for timings
    const entity = this.entity(props, protocolConfig)

    logs.reactRendered(loggingConfig);

    // TODO: move this to the prop passing pattern (required props, inferred props)(DAOMember, Member?)
    return (
      <>
      <Protocol.Config>
        {config => {
          console.log(`Protocol.Config ${config}`);
          if (config && config !== protocolConfig) {
            console.log("mergeState(protocolConfig)");
            this.mergeState({ protocolConfig: config });
          }
          return (<></>);
        }}
      </Protocol.Config>
      <Logging.Config>
        {config => {
          console.log(`Logging.Config ${config}`);
          if (config && config !== loggingConfig) {
            console.log("mergeState(loggingConfig)");
            this.mergeState({ loggingConfig : config });
          }
          return (<></>);
        }}
      </Logging.Config>
      {this.gatherInferredProps()}
      <EntityProvider value={entity}>
      <DataProvider value={data}>
      <CodeProvider value={code}>
      <LogsProvider value={logs}>
      {typeof children === "function"
      ? children(entity, data, code, logs)
      : {children}}
      </LogsProvider>
      </CodeProvider>
      </DataProvider>
      </EntityProvider>
      </>
    )
  }

  public componentWillUnmount() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = undefined;
    }
  }

  private createEntityWithProps(props: Props, protocol: ProtocolConfig | undefined): Entity | undefined {
    const { logs, loggingConfig } = this.state;

    if (!protocol) {
      // TODO: logs.protocolConfigMissing();
      return undefined;
    }

    logs.entityCreated(loggingConfig);

    this.clearPrevState();

    try {
      const entity = this.createEntity(props, protocol);

      logs.dataQueryStarted(loggingConfig);

      // subscribe to this entity's state changes
      this._subscription = entity.state().subscribe(
        this.onQueryData,
        this.onQueryError,
        this.onQueryComplete
      );

      // TODO: create code + prose
      return entity;
    } catch (error) {
      logs.entityCreationFailed(loggingConfig, error);
      return undefined;
    }
  }

  private clearPrevState() {
    this.mergeState({
      data: undefined,
      code: undefined,
      // TOOD: prose: undefined
    });
  }

  private onQueryData(data: Data) {
    const { logs, loggingConfig } = this.state;

    logs.dataQueryReceivedData(loggingConfig);

    this.mergeState({
      data: data
    });
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
