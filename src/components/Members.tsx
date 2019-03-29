import * as React from "react";
import {
  CEntity,
  CProps,
  ComponentList
} from "../runtime/ComponentList";
import { Member } from "./Member";
import DAO, { DAOEntity } from "./DAO";
import Arc from "@daostack/client";
import { Observable } from "rxjs";

interface Props {
  dao?: DAOEntity;
}

class Members extends ComponentList<Props, Member>
{
  createObservableEntities(props: Props, arc: Arc): Observable<CEntity<Member>[]> {
    // TODO: better error handling
    if (props.dao === undefined) {
      throw Error("Missing DAO prop");
    }

    return props.dao.members();
  }

  gatherInferredProps(): React.ReactNode {
    if (this.props.dao === undefined) {
      return (
        <DAO.Entity>{entity => () => this.setProp("dao", entity)}</DAO.Entity>
      );
    } else {
      return (<></>);
    }
  }

  renderComponent(entity: CEntity<Member>, children: any): React.ComponentElement<CProps<Member>, any> {
    return (
      <Member address={entity.address} dao={this.props.dao}>
        {children}
      </Member>
    )
  }
}

export default Members;

export {
  Members
};
