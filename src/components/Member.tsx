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

interface Props {
  // Address of the member
  address: string;

  // The DAO this member is apart of
  dao?: DAOEntity;
}

class Member extends Component<Props, Entity, Data, Code>
{
  // TODO: Arc could be a contextualized prop on the DAO instead of in each component
  // Just make "Arc" a component?
  createEntity(props: Props, arc: Arc): Entity {
    // TODO: better error handling? maybe have another abstract function
    // that's a predicate that lets you know if entity can be created w/
    // provided data & gives user friendly sanitization errors?
    if (this.props.dao === undefined) {
      throw Error("Missing DAO prop");
    }

    return this.props.dao.member(props.address);
  }

  inferProps(): React.ReactNode {
    if (this.props.dao === undefined) {
      return (
        <DAO.Entity>{entity => () => this.addProp("dao", entity)}</DAO.Entity>
      );
    } else {
      return (<></>);
    }
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

export default Member;

export {
  Member,
  Props  as MemberProps,
  Entity as MemberEntity,
  Data   as MemberData,
  Code   as MemberCode,
  ComponentLogs
};
