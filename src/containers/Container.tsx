import * as React from "react";
import { Context } from "react";
import * as R from "ramda";

// TODO: Generalize this layer...? Web3Binding :)
import Arc from "@daostack/client";
import arc from "../lib/arc";

// TODO: get rid of?
import { Observable, Subscription } from "rxjs";

/*
  Tuple:
  https://en.wikipedia.org/wiki/Ricardian_contract
  This form proposes a *tuple* of {prose, parameters, code}
  where the parameters can particularise or specialise the
  legal prose and the computer code in order to create a
  single deal out of a template or *library of components*.
*/
interface Tuple<GraphSchema, ViewMethods, ActionMethods> {
  // TODO: add riacardian template (prose), maybe rename these props to code (actions), prose (ricard), parameters (graph & views)
  graph?: GraphSchema,
  views?: ViewMethods, // TODO: combine graph & views into same object
  actions?: ActionMethods
}

interface Query<GraphSchema> {
  createTime: number,
  isLoading: boolean | null,
  error: Error | null,
  complete: boolean,
  observable: Observable<GraphSchema> | null
}

interface State<GraphSchema, ViewMethods, ActionMethods> {
  _query: Query<GraphSchema>,
  _tuple: Tuple<GraphSchema, ViewMethods, ActionMethods>
}

type RootProps<GraphSchema, ViewMethods, ActionMethods> = Tuple<GraphSchema, ViewMethods, ActionMethods>;

export abstract class Container<Props, GraphSchema, ViewMethods, ActionMethods> 
extends React.Component<
  Props & RootProps<GraphSchema, ViewMethods, ActionMethods>,
  State<GraphSchema, ViewMethods, ActionMethods>
> {

  // TODO: abstract methods
  // create instance
  // init graph
  // init views
  // init actions
  //// might need a proxy layer in between the client library and this code...
  //// I think the answer is yes definitely...
  abstract createObservable(props: Props, arc: Arc): Observable<GraphSchema>;

  protected static GraphContext<GraphSchema>(): Context<GraphSchema> {
    return this.graphContext as any;
  }

  protected static ViewsContext<ViewMethods>(): Context<ViewMethods> {
    return this.viewsContext as any;
  }

  protected static ActionsContext<ActionMethods>(): Context<ActionMethods> {
    return this.actionsContext as any;
  }

  // TODO: move query inside Graph?
  protected static QueryContext<GraphSchema>(): Context<Query<GraphSchema>> {
    return this.queryContext as any;
  }

  private static graphContext = React.createContext({ });
  private static viewsContext = React.createContext({ });
  private static actionsContext = React.createContext({ });
  private static queryContext = React.createContext({ });

  // TODO: abstract this away
  private subscription: Subscription | null = null;

  constructor(props: Props & RootProps<GraphSchema, ViewMethods, ActionMethods>) {
    super(props);

    this.state = {
      _query: {
        createTime: 0, // TODO: get time
        isLoading: null,
        error: null,
        complete: false,
        observable: null
      },
      _tuple: {
        graph: this.props.graph,
        views: this.props.views,
        actions: this.props.actions
      }
    };
  }

  public render() {
    const GraphProvider = Container.GraphContext<GraphSchema>().Provider as any;
    const ViewsProvider = Container.ViewsContext<ViewMethods>().Provider as any;
    const ActionsProvider = Container.ActionsContext<ActionMethods>().Provider as any;
    const QueryProvider = Container.QueryContext<GraphSchema>().Provider as any;

    const { children } = this.props;
    const { _query, _tuple } = this.state;

    // TODO: check for Props chanages
    /// 1. take hash of (this.props as Props)
    /// 2. if (this.propsHash !== hash(this.props as Props))
    /// 3.   re-set state on the child (setState(this.props as Props))

    this.updateQuery();

    return (
      <QueryProvider value={_query}>
      <GraphProvider value={_tuple.graph}>
      <ViewsProvider value={_tuple.views}>
      <ActionsProvider value={_tuple.actions}>
        {children}
      </ActionsProvider>
      </ViewsProvider>
      </GraphProvider>
      </QueryProvider>
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

    const query = this.state._query;

    // start the query if it's not already
    if (query.observable === null) {
      this.mergeState({
        _query: {
          observable: this.createObservable((this.props as any) as Props, arc)
        }
      });
    } else if (query.isLoading === null) {
      this.mergeState({
        _query: { isLoading: true }
      });

      this.subscription = query.observable.subscribe(
        (data: GraphSchema) => {
          this.mergeState({
            _query: { isLoading: false },
            _tuple: { graph: data }
          });
        },
        (error: Error) => { 
          this.mergeState({
            _query: { error }
          });
        },
        () => {
          this.mergeState({
            _query: { complete: true }
          });
        }
      );
    }
  }

  private teardownSubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
