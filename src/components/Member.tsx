import * as React from "react";
import { Component, ComponentLogs } from "./Component";
import Arc, { Member as Entity, IMemberState as Data } from "@daostack/client";
import DAO, { DAOEntity } from "./DAO";

type Code = {
  // maybe wrap this better so the contracts
  // are underneath the higher level functions?
  // contractName: ContractType (TypeChain)
}

interface RequiredProps {
  // Address of the member
  address: string;
}

interface ContextualProps {
  // The DAO this member is apart of
  dao: DAOEntity;
}

type Props = RequiredProps & ContextualProps;

export class Member extends Component<Props, Entity, Data, Code>
{
  createEntity(props: Props, arc: Arc): Entity {
    return props.dao.member(props.address);
  }

  public static get Entity() {
    return Component.EntityContext<Entity>().Consumer;
  }

  public static get Data() {
    return Component.DataContext<Data>().Consumer;
  }

  public static get Code() {
    return Component.CodeContext<Code>().Consumer;
  }

  public static get Logs() {
    return Component.LogsContext().Consumer;
  }
}

const MemberWrapper: React.FunctionComponent<RequiredProps> = ({ address, children }) => (
  <DAO.Entity>
    {(entity: DAOEntity | undefined) => (
      entity ?
      <Member address={address} dao={entity}>
        {children}
      </Member>
      : <div>loading...</div>
    )}
  </DAO.Entity>
);

export default MemberWrapper;

export {
  Props as MemberProps,
  Entity as MemberEntity,
  Data as MemberData,
  Code as MemberCode,
  ComponentLogs
};
