import * as React from "react";
import {
  Component,
  ComponentLogs,
  BaseProps
} from "../runtime";
import {
  DAO,
  DAOEntity
} from "./";
import {
  Member as Entity,
  IMemberState as Data
} from "@daostack/client";

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

interface InferredProps {
  // The DAO this member is apart of
  dao: DAOEntity | undefined;
}

type Props = RequiredProps & InferredProps & BaseProps;

class DAOMember extends Component<Props, Entity, Data, Code>
{
  // TODO: Arc could be a contextualized prop on the DAO instead of in each component
  // Just make "Arc" a component?
  createEntity(): Entity {
    const { dao, address } = this.props;

    // TODO: better error handling? maybe have another abstract function
    // that's a predicate that lets you know if entity can be created w/
    // provided data & gives user friendly sanitization errors?
    if (!dao) {
      throw Error("DAO Missing: Please provide this field as a prop, or use the inference component.");
    }
    return dao.member(address);
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
  render() {
    const { address, children } = this.props;

    // TODO: doing Logging.Config everywhere is trash... just make it global?
    return (
      <DAO.Entity>
      {entity => (
        <DAOMember address={address} dao={entity}>
        {children}
        </DAOMember>
      )}
      </DAO.Entity>
    )
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
  DAOMember,
  Member,
  Props  as MemberProps,
  Entity as MemberEntity,
  Data   as MemberData,
  Code   as MemberCode,
  ComponentLogs
};
