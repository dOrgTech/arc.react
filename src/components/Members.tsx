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
    return props.dao.members();
  }

  renderComponent(entity: CEntity<Member>, children: any): React.ComponentElement<CProps<Member>, any> {
    return (
      <Member address={entity.address} dao={this.props.dao}>
        {children}
      </Member>
    )
  }
}

/*const Members: React.FunctionComponent<RequiredProps> = ({ children }) => (
  <DAO.Entity>
    {(entity: DAOEntity | undefined) => (
      entity ?
      <DAOMembers dao={entity}>
        {children}
      </DAOMembers>
      : <div>loading...</div>
    )}
  </DAO.Entity>
);
*/

export default Members;

export {
  Members
}
