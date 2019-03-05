import { Container } from "./Container";
import Arc, { IDAOState as DAOSchema } from "@daostack/client";
import { Observable } from "rxjs";

interface Props {
  address: string;
}

// TODO: add action & view method props
// TODO: long term, only have read & write semantics. read (props & funcs / transforms)
// TODO: short term, views & actions can have their mappings defined here
/*
  const views = {
    someView: (arg: boolean): uint => {
      // use typechain to invoke a view
      var value = contract.view(arg, "some other arg")
      return value.first // example of complex mapping
    }
  }
*/

type GraphSchema = DAOSchema;
type ViewMethods = { /* view methods */ };
type ActionMethods = { /* action (tx) methods */ };

export default class DAO extends Container<
  Props,
  GraphSchema,
  ViewMethods,
  ActionMethods
>
{
  createObservable(props: Props, arc: Arc): Observable<GraphSchema> {
    return arc.dao(props.address).state
  }

  public static get Graph() {
    return Container.GraphContext<GraphSchema>().Consumer;
  }

  public static get Views() {
    return Container.ViewsContext<ViewMethods>().Consumer;
  }

  public static get Actions() {
    return Container.ActionsContext<ActionMethods>().Consumer;
  }

  public static get Query() {
    return Container.QueryContext<GraphSchema>().Consumer;
  }
}

/*
import DAO from "./DAO";

<DAO address="0x34234234">
  <DAO.Graph>
    {graph => (
      <div>dao.name</div>
    )}
  </DAO.Graph>
</DAO>
*/

/*
<DAO address="0x34234234">
  <DAO.Graph>
    { ({ name, address }) => (
      <div>name + address</div>
    )}
  </DAO.Graph>
</DAO>
*/

/*
<DAO address="0x34234234">
  <DAO.Actions>
    {actions=> await actions.createProposal(...)}
  </DAO.Actions>
</DAO>
*/

/*
<DAO address="0x34234234">
  <DAO.Views>
    {views=>(
      <div>await views.getBalance()</div>
    )}
  </DAO.Views>
</DAO>
*/

/*
<DAO address="0x34234234">
{
  (graph, views, actions) => (
    <div>graph.name</div>
  )
}
</DAO>
*/
