import * as React from "react";
import { Component, ComponentLogs } from "../runtime/Component";
import Arc, { Member as Entity, IMemberState as Data } from "@daostack/client";
import DAO, { DAOEntity } from "./DAO";

type Code = {
  // maybe wrap this better so the contracts
  // are underneath the higher level functions?
  // contractName: ContractType (TypeChain)
}

const entityConsumer = Component.EntityContext<Entity>().Consumer;
const dataConsumer   = Component.DataContext<Data>().Consumer;
const codeConsumer   = Component.CodeContext<Code>().Consumer;
const logsConsumer   = Component.LogsContext().Consumer;

interface RequiredProps {
  // Address of the member
  address: string;
}

interface ContextualProps {
  // The DAO this member is apart of
  dao: DAOEntity;
}

type Props = RequiredProps & ContextualProps;

class DAOMember extends Component<Props, Entity, Data, Code>
{
  createEntity(props: Props, arc: Arc): Entity {
    return props.dao.member(props.address);
  }

  public static get Entity() {
    return entityConsumer;
  }

  public static get Data() {
    return dataConsumer;
  }

  public static get Code() {
    return codeConsumer;
  }

  public static get Logs() {
    return logsConsumer;
  }
}

class Member extends React.Component<RequiredProps>
{
  public static get Entity() {
    return entityConsumer;
  }

  public static get Data() {
    return dataConsumer;
  }

  public static get Code() {
    return codeConsumer;
  }

  public static get Logs() {
    return logsConsumer;
  }

  render() {
    const { address, children } = this.props;

    return (
      <DAO.Entity>
        {(entity: DAOEntity | undefined) => (
          entity ?
          <DAOMember dao={entity} address={address}>
            {children}
          </DAOMember>
          : <div>loading...</div>
        )}
      </DAO.Entity>
    );
  }
}

export default Member;

export {
  Member,
  DAOMember,
  Props  as MemberProps,
  Entity as MemberEntity,
  Data   as MemberData,
  Code   as MemberCode,
  ComponentLogs
};
