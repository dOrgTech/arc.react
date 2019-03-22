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
