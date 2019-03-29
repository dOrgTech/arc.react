import * as React from "react";
import {
  CEntity,
  CProps,
  ComponentList
} from "../runtime/ComponentList";
import { DAO } from "./DAO";
import Arc from "@daostack/client";
import { Observable } from "rxjs";

interface Props { }

class DAOs extends ComponentList<Props, DAO>
{
  createObservableEntities(props: Props, arc: Arc): Observable<CEntity<DAO>[]> {
    return arc.daos();
  }

  gatherInferredProps(): React.ReactNode {
    return (<></>);
  }

  renderComponent(entity: CEntity<DAO>, children: any): React.ComponentElement<CProps<DAO>, any> {
    return (
      <DAO address={entity.address}>
        {children}
      </DAO>
    );
  }
}

export default DAOs;

export {
  DAOs
};
