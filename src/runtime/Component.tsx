import * as React from "react";
import { Context } from "react";
import * as R from "ramda";
import memoize from "memoize-one";
import { Subscription } from "rxjs";
import { IStateful } from "@daostack/client/src/types"

import { ComponentLogs } from "./logging/ComponentLogs";
import { Logging } from "./Logging";
import { LoggingConfig, DefaultLoggingConfig } from "./configs/LoggingConfig";
import { Protocol } from "./Protocol";
import { ProtocolConfig } from "./configs/ProtocolConfig";

type PropertyBag = { [propName: string]: any }
 
interface State<Data, Code> {
  // Context Feeds
  data?: Data;
  code?: Code;
  // TODO: Prose
  // TODO: get rid of
  protocolConfig?: ProtocolConfig;

  // Diagnostics for the component
  logs: ComponentLogs;
  loggingConfig: LoggingConfig;

  // Properties inferred, used for the derived class
  inferredProps: PropertyBag;
}

export abstract class Component<
  Props,
  Entity extends IStateful<Data>,
  Data,
  Code
> extends React.Component<
    Props, State<Data, Code>
  >
{
  // Create the entity this component represents. This entity gives access
  // to the component's code, prose, and data. For example: DAO, Proposal, Member.
  // Note: This entity is not within the component's state, but instead a memoized
  // property that will be recreated whenever necessary. See `private entity` below...
  protected abstract createEntity(props: Props, protocol: ProtocolConfig): Entity;

  protected abstract inferProps(): React.ReactNode;

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
    const { data, code, logs, protocolConfig, loggingConfig } = this.state;

    // TODO: change "context" to "infer"
    // merge our component infered props into the normal props
    const props = this.mergeInferredProps();

    // create & fetch the entity
    // TODO: this should throw errors. Upon first error, logging marks "loading started"
    // then when first success is seen, record that time too for timings
    const entity = this.entity(props, protocolConfig)

    logs.reactRendered(loggingConfig);

    return (
      <>
      <Protocol.Config>
        {config => () => { if (config) this.mergeState({ protocolConfig: config }) }}
      </Protocol.Config>
      <Logging.Config>
        {config => () => { if (config) this.mergeState({ loggingConfig : config }) }}
      </Logging.Config>
      {() => this.inferProps()}
      {() => {
        if (typeof children === "function") {
          return children(entity, data, code, logs);
        } else {
          return (
            <EntityProvider value={entity}>
            <DataProvider value={data}>
            <CodeProvider value={code}>
            <LogsProvider value={logs}>
              {children}
            </LogsProvider>
            </CodeProvider>
            </DataProvider>
            </EntityProvider>
          )
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

  private mergeState(merge: any) {
    this.setState(
      R.mergeDeepRight(this.state, merge)
    );
  }

  // TODO: make sure this works
  protected addProp(name: string, value: any) {
    this.mergeState({ inferredProps: { [name]: value } });
  }

  // TODO: ensure this works
  private mergeInferredProps(): Props {
    const props = this.props;
    const inferredProps = this.state.inferredProps;

    for (const propName in inferredProps) {
      props[propName] = inferredProps[propName]
    }

    return props;
  }

  private createEntityWithProps(props: Props, protocol: ProtocolConfig | undefined): Entity | undefined {
    const { logs, loggingConfig } = this.state;

    if (!protocol) {
      // TODO: logs.protocolConfigMissing(platform);
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
