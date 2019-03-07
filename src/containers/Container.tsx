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
  }

  public render() {
    const EntityProvider = Container.EntityContext<Entity>().Provider as any;
    const DataProvider = Container.DataContext<Data>().Provider as any;
    const CodeProvider = Container.CodeContext<Code>().Provider as any;
    const QueryProvider = Container.QueryContext<Data>().Provider as any;

    const { children } = this.props;
    const { entity, data, code, query } = this.state;

    this.updateQuery();

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
    this.updateQuery();
  }

  // TODO: idk about this...
  public componentWillReceiveProps(nextProps: any) {
    if (nextProps.children !== this.props.children) {
      this.teardownSubscription();
      this.updateQuery();
    }
  }

  public componentWillUnmount() {
    this.teardownSubscription();
  }

  private mergeState(merge: any) {
    this.setState(
      R.mergeDeepRight(this.state, merge)
    );
  }

  private updateQuery() {
    const { query } = this.state;

    // start the query if it's not already
    if (query === undefined) {
      const entity: Entity = this.createEntity(this.props, arc);
      const query: Query<Data> = {
        createTime: Date.now(),
        subCount: 0,
        isLoading: false,
        complete: false,
        observable: entity.state()
      };

      this.mergeState({
        entity,
        query
      });
    } else if (this._subscription === undefined) {
      const subCount = ++query.subCount;

      this.mergeState({
        query: {
          isLoading: true,
          complete: false,
          subCount
        }
      });

      // TODO: handle error case & try to requery every so often...
      this._subscription = query.observable.subscribe(
        (data: Data) => {
          this.mergeState({
            data: data,
            query: { isLoading: false }
          });
        },
        (error: Error) => { 
          this.mergeState({
            query: { error }
          });
        },
        () => {
          this.mergeState({
            query: { complete: true }
          });
        }
      );
    }
  }

  private teardownSubscription() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = undefined;
    }
  }
}
