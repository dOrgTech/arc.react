import { Container as Base } from "./Container";
import Arc, { IDAOState as DAOSchema } from "@daostack/client";
import { Observable } from "rxjs";

interface Props {
  address: string;
}

// TODO: add action & view method props
export class Container extends Base<
  Props, DAOSchema, { /* view methods */ }, { /* action (tx) methods */ }
> {
  createObservable(props: Props, arc: Arc): Observable<DAOSchema> {
    return arc.dao(props.address).state
  }
}

export const Graph = Container.Graph<DAOSchema>().Consumer;
export const Views = Container.Views<{ /* view methods */ }>().Consumer;
export const Actions = Container.Actions<{/* action (tx) methods */}>().Consumer;
export const Status = Container.Query<DAOSchema>().Consumer;

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
