import { Component, ComponentLogs } from "./Component";
import Arc, { DAO as Entity, IDAOState as Data } from "@daostack/client";

// thought:
// - base class that is constructed w/ entity
// - derived class that defines public "nice" methods
// - - methods use entity to invoke transactions

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
  // Address of the DAO Avatar
  address: string;
}

class DAO extends Component<Props, Entity, Data, Code>
{
  createEntity(props: Props, arc: Arc): Entity {
    return arc.dao(props.address);
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

export default DAO;

export {
  DAO,
  Props as DAOProps,
  Entity as DAOEntity,
  Data as DAOData,
  Code as DAOCode,
  ComponentLogs
};
