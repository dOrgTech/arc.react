import {
  CompEntity,
  ComponentList
} from "./ComponentList";
import DAO from "./DAO";
import Arc from "@daostack/client";
import { Observable } from "rxjs";

interface Props { }

// this is the easiest... avoids the code duplication... idk.
export default class DAOs extends ComponentList<Props, DAO>
{
  createEntities(props: Props, arc: Arc): Observable<CompEntity<DAO>[]> {
    return arc.daos();
  }
}

// Ideal usage TODO: refine this...
/*
/// DAOs list drawer
<DAOs> // able to turn off automatic iteration
  {() => (
    <DAO.Data>
      {dao => (
        <div>{dao.name}</div>
      )}
    </DAO.Data>
  )}
</DAOs>
*/

/*
/// DAOs Data
<DAOs>
  <DAOs.Data autoIterate=false>
    {(daos: IDAOState[]) => (
      <div>daos[0].name</div>
    )}
  </DAOs.Data>
</DAOs>
*/


/*
/// DAOs entity getter
<DAOs passEntity=true>
  {(daos: DAO[]) => (
    <>
      {daos.map(...)}
    </>
  )}
</DAOs>
*/