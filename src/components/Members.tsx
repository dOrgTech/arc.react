import * as React from "react";
import {
  CEntity,
  CProps,
  ComponentList
} from "./ComponentList";
import { Member } from "./Member";
import DAO, { DAOEntity } from "./DAO";
import Arc from "@daostack/client";
import { Observable } from "rxjs";

interface RequiredProps { }

interface ContextualProps {
  dao: DAOEntity;
}

type Props = RequiredProps & ContextualProps;

export class Members extends ComponentList<Props, Member>
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

const MembersWrapper: React.FunctionComponent<RequiredProps> = ({ children }) => (
  <DAO.Entity>
    {(entity: DAOEntity | undefined) => (
      entity ?
      <Members dao={entity}>
        {children}
      </Members>
      : <div>loading...</div>
    )}
  </DAO.Entity>
);

export default MembersWrapper;
