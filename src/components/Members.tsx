import * as React from "react";
import {
  CEntity,
  CProps,
  ComponentList
} from "./ComponentList";
import { DAOMember } from "./Member";
import DAO, { DAOEntity } from "./DAO";
import Arc from "@daostack/client";
import { Observable } from "rxjs";

interface RequiredProps { }

interface ContextualProps {
  dao: DAOEntity;
}

type Props = RequiredProps & ContextualProps;

export class DAOMembers extends ComponentList<Props, DAOMember>
{
  createObservableEntities(props: Props, arc: Arc): Observable<CEntity<DAOMember>[]> {
    return props.dao.members();
  }

  renderComponent(entity: CEntity<DAOMember>, children: any): React.ComponentElement<CProps<DAOMember>, any> {
    return (
      <DAOMember address={entity.address} dao={this.props.dao}>
        {children}
      </DAOMember>
    )
  }
}

const Members: React.FunctionComponent<RequiredProps> = ({ children }) => (
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

export default Members;

export {
  Members
}
