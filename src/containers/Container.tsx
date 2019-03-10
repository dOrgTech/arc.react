import * as React from "react";
import { Context } from "react";
import * as R from "ramda";

// TODO: Generalize this layer...? Web3Binding :)
import Arc from "@daostack/client";
import arc from "../lib/arc";
import { IStateful } from "@daostack/client/src/types"

// TODO: get rid of?
import { Observable, Subscription } from "rxjs";

interface Query<Data> {
  createTime: number;
  subCount: number;
  isLoading: boolean;
  complete: boolean;
  error?: Error;
  observable: Observable<Data>;
}

interface State<Entity, Data, Code> {
  entity?: Entity;
  data?: Data;
  code?: Code;
  query?: Query<Data>;
}

export abstract class Container<Props, Entity extends IStateful<Data>, Data, Code>
  extends React.Component<Props, State<Entity, Data, Code>>
{
  // TODO: abstract this away
  // create instance?
  // init data?
  //// might need a proxy layer in between the client library and this code...
  //// I think the answer is yes definitely...
  protected abstract createEntity(props: Props, arc: Arc): Entity;

  protected static EntityContext<Entity>(): Context<Entity> {
    return Container._EntityContext as any;
  }

  protected static DataContext<Data>(): Context<Data> {
    return Container._DataContext as any;
  }

  protected static CodeContext<Code>(): Context<Code> {
    return Container._CodeContext as any;
  }

  protected static QueryContext<Data>(): Context<Query<Data>> {
    return Container._QueryContext as any;
  }

  private static _EntityContext = React.createContext({ });
  private static _DataContext = React.createContext({ });
  private static _CodeContext = React.createContext({ });

  // TODO: get rid of this...
  private static _QueryContext = React.createContext({ });

  private _subscription?: Subscription;

  constructor(props: Props) {
    super(props);

    this.state = { };

    this.createQuery = this.createQuery.bind(this);
    this.onQueryData = this.onQueryData.bind(this);
    this.onQueryError = this.onQueryError.bind(this);
    this.onQueryComplete = this.onQueryComplete.bind(this);
    this.teardownQuery = this.teardownQuery.bind(this);
    this.mergeState = this.mergeState.bind(this);
  }

  public shouldComponentUpdate(nextProps: any, nextState: any) {
    console.log("HERE");
    return true;
  }

  public render() {
    const EntityProvider = Container.EntityContext<Entity>().Provider as any;
    const DataProvider = Container.DataContext<Data>().Provider as any;
    const CodeProvider = Container.CodeContext<Code>().Provider as any;
    const QueryProvider = Container.QueryContext<Data>().Provider as any;

    const { children } = this.props;
    const { entity, data, code, query } = this.state;

    console.log("rendering")
    return (
      <EntityProvider value={entity}>
      <DataProvider value={data}>
      <CodeProvider value={code}>
      <QueryProvider value={query}>
        {children}
      </QueryProvider>
      </CodeProvider>
      </DataProvider>
      </EntityProvider>
    )
  }

  public componentWillMount() {
    console.log("will mount");
    this.createQuery();
  }

  public componentWillUnmount() {
    console.log("will unmount");
    this.teardownQuery();
  }

  // TODO: handle error case & try to requery every so often...
  private createQuery() {
    console.log("Create Query");

    // create the entity with our component's props
    const entity: Entity = this.createEntity(this.props, arc);

    // subscribe to this entity's state changes
    this._subscription = entity.state().subscribe(
      this.onQueryData,
      this.onQueryError,
      this.onQueryComplete
    );

    const existingQuery = this.state.query;

    this.mergeState({
      entity,
      query: {
        createTime: Date.now(),
        subCount: existingQuery ? ++existingQuery.subCount : 0,
        isLoading: true,
        complete: false,
        observable: entity.state()
      }
    });
  }

  private onQueryData(data: Data) {
    console.log("Query Data")
    this.mergeState({
      data: data,
      query: { isLoading: false }
    });
  }

  private onQueryError(error: Error) {
    console.log("Query Error")
    this.mergeState({
      query: { error }
    });
  }

  private onQueryComplete() {
    console.log("Query Complete")
    this.mergeState({
      query: { complete: true }
    });
  }

  private teardownQuery() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = undefined;
    }
  }

  private mergeState(merge: any) {
    console.log("state change");
    this.setState(
      R.mergeDeepRight(this.state, merge)
    );
    this.forceUpdate();
  }
}
