import * as React from "react";
import * as R from "ramda";
import { Context } from "react";
import memoize from "memoize-one";
import { Subscription } from "rxjs";
import { IStateful } from "@daostack/client/src/types"

import { BaseProps } from "./BaseComponent";
import { ComponentLogs } from "./logging/ComponentLogs";
import { LoggingConfig, DefaultLoggingConfig } from "./configs/LoggingConfig";

interface State<Data, Code> {
  // Context Feeds
  data?: Data;
  code?: Code;
  // TODO: Prose

  // Diagnostics for the component
  logs: ComponentLogs;
}

export abstract class Component<
  Props extends BaseProps,
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
  protected abstract createEntity(): Entity;

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
      logs: new ComponentLogs()
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
    const { data, code, logs } = this.state;

    // create & fetch the entity
    // TODO: this should throw errors. Upon first error, logging marks "loading started"
    // then when first success is seen, record that time too for timings
    const entity = this.entity(this.props)

    logs.reactRendered(this.LoggingConfig);

    return (
      <>
      <EntityProvider value={entity}>
      <DataProvider value={data}>
      <CodeProvider value={code}>
      <LogsProvider value={logs}>
      {typeof children === "function"
      ? children(entity, data, code, logs)
      : <>{children}</>}
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

  private createEntityWithProps(props: Props): Entity | undefined {
    const { logs } = this.state;

    logs.entityCreated(this.LoggingConfig);

    this.clearPrevState();

    try {
      const entity = this.createEntity();

      logs.dataQueryStarted(this.LoggingConfig);

      // subscribe to this entity's state changes
      this._subscription = entity.state().subscribe(
        this.onQueryData,
        this.onQueryError,
        this.onQueryComplete
      );

      // TODO: create code + prose
      return entity;
    } catch (error) {
      logs.entityCreationFailed(this.LoggingConfig, error);
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
    const { logs } = this.state;

    logs.dataQueryReceivedData(this.LoggingConfig);

    this.mergeState({
      data: data
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
