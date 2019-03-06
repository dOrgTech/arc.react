import { Container } from "./Container";
import Arc, { DAO as Entity, IDAOState as Data } from "@daostack/client";

/*
import DAOContainer from "./DAO";
import Arc, { DAO as Entity, IDAOState as Data } from "@daostack/client";

// this is the easiest... avoids the code duplication... idk.
export default class DAOs extends ConatinerList<DAOContainer>
{
  createEntities(props: Props, arc: Arc): Entity[] {
    return arc.daos();
  }
}
*/

// Ideal usage
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
/// DAOs entity getter
<DAOs passEntity=true>
  {(daos: DAO[]) => (
    <>
      {daos.map(...)}
    </>
  )}
</DAOs>
*/

/*
/// DAOs Data
<DAOs>
  <DAOs.Data>
    {(daos: IDAOState[]) => (
      <div>daos[0].name</div>
    )}
  </DAOs.Data>
</DAOs>
*/
