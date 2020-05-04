import * as React from "react";
import memoize from "memoize-one";
import { Subscription } from "rxjs";
// TODO: This should not be opinionated to arc
import {
  Entity as ArcEntity,
  IEntityState as IArcEntityState,
} from "@dorgtech/arc.js";

import { ComponentLogs } from "./logging/ComponentLogs";

export interface State<Data extends IArcEntityState> {
  data?: Data;
  // Diagnostics for the component
  logs: ComponentLogs;
}

export abstract class Component<
  Props,
  Entity extends ArcEntity<Data>,
  Data extends IArcEntityState
> extends React.Component<Props, State<Data>> {
  // Create the entity this component represents. This entity gives access
  // to the component's data. For example: DAO, Proposal, Member.
  // Note: This entity is not within the component's state, but instead a memoized
  // property that will be recreated whenever necessary. See `private entity` below...
  protected abstract createEntity(): Entity;

  // Complete any asynchronous initialization work needed by the Entity
  protected async initialize(entity: Entity): Promise<void> {
    try {
      const state = await entity.fetchState();
      this.onQueryData(state);
    } catch (e) {
      this.onQueryError(e);
    }
  }

  // See here for more information on the React.Context pattern:
  // https://reactjs.org/docs/context.html
  protected static _EntityContext: React.Context<any | undefined>;
  protected static _DataContext: React.Context<any | undefined>;
  protected static _LogsContext: React.Context<ComponentLogs | undefined>;

  private entity = memoize(
    // This will only run when the function's arguments have changed :D
    // allowing us to only recreated/refetch the entity data when the props or arc context have changed.
    // See: https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization
    this.createEntityWithProps
  );

  // Our graphql query's subscriber object
  private _subscription?: Subscription | null;

  // If the initialization logic after mount has finished
  private _initialized: boolean;

  constructor(props: Props) {
    super(props);

    this._initialized = false;

    this.state = {
      logs: new ComponentLogs(),
    };
    this.onQueryData = this.onQueryData.bind(this);
    this.onQueryError = this.onQueryError.bind(this);
    this.onQueryComplete = this.onQueryComplete.bind(this);
  }

  // This trick allows us to access the static objects
  // defined in the derived class. See this code sample:
  // https://github.com/Microsoft/TypeScript/issues/5989#issuecomment-163066313
  // @ts-ignore: This should always be there
  "constructor": typeof Component;

  public render() {
    const EntityProvider = this.constructor._EntityContext.Provider as any;
    const DataProvider = this.constructor._DataContext.Provider as any;
    const LogsProvider = this.constructor._LogsContext.Provider;

    const children = this.props.children;
    const { data, logs } = this.state;

    // create & fetch the entity
    // TODO: this should throw errors. Upon first error, logging marks "loading started"
    // then when first success is seen, record that time too for timings
    const entity = this._initialized ? this.entity(this.props) : undefined;

    logs.reactRendered();

    return (
      <>
        <EntityProvider value={entity}>
          <DataProvider value={data}>
            <LogsProvider value={logs}>{children}</LogsProvider>
          </DataProvider>
        </EntityProvider>
      </>
    );
  }

  public async componentDidMount(): Promise<void> {
    const { logs } = this.state;

    try {
      await this.entity(this.props);
      this._initialized = true;

      this.forceUpdate();
    } catch (e) {
      logs.entityCreationFailed(e);
      this.setState({
        data: this.state.data,
        logs: logs.clone(),
      });
    }

    return Promise.resolve();
  }

  public componentWillUnmount() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = undefined;
    }
  }

  private async createEntityWithProps(
    props: Props
  ): Promise<Entity | undefined> {
    const { logs } = this.state;

    logs.entityCreated();

    // TODO: find a way to get rid of this, as it's
    //causing a react warning/error during render.
    this.clearPrevState();

    try {
      const entity = this.createEntity();
      await this.initialize(entity);
      logs.dataQueryStarted();

      // subscribe to this entity's state changes
      // if (props.noSub) {
      // this._subscription = entity.state({}).subscribe(this.onQueryData, this.onQueryError, this.onQueryComplete);
      // }

      return entity;
    } catch (e) {
      logs.entityCreationFailed(e);
      this.setState({
        data: this.state.data,
        logs: logs.clone(),
      });
      return undefined;
    }
  }

  private clearPrevState() {
    this.setState({
      data: undefined,
    });
  }

  private onQueryData(data: Data) {
    const { logs } = this.state;
    logs.dataQueryReceivedData();
    this.setState({
      data,
    });
  }

  private onQueryError(error: Error) {
    const { logs } = this.state;
    logs.dataQueryFailed(error);
    this.setState({
      data: this.state.data,
      logs: logs.clone(),
    });
  }

  private onQueryComplete() {
    const { logs } = this.state;
    logs.dataQueryCompleted();
    this.setState({
      data: this.state.data,
      logs: logs.clone(),
    });
  }
}
