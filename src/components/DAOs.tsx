import * as React from "react";
import {
  CEntity,
  CProps,
  ComponentList
} from "./ComponentList";
import DAO from "./DAO";
import Arc from "@daostack/client";
import { Observable } from "rxjs";

interface Props { }

// this is the easiest... avoids the code duplication... idk.
export default class DAOs extends ComponentList<Props, DAO>
{
  createObservableEntities(props: Props, arc: Arc): Observable<CEntity<DAO>[]> {
    return arc.daos();
  }

  renderComponent(entity: CEntity<DAO>, children: any): React.ComponentElement<CProps<DAO>, any> {
    return (
      <DAO address={entity.address}>
        {children}
      </DAO>
    );
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