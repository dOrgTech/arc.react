import { Component, ComponentLogs } from "./Component";
import Arc, { DAO as Entity, IDAOState as Data } from "@daostack/client";

type Code = {
  // maybe wrap this better so the contracts
  // are underneath the higher level functions?
  // contractName: ContractType (TypeChain)
}

interface Props {
  // Address of the DAO Avatar
  address: string;
}

export class DAO extends Component<Props, Entity, Data, Code>
{
  createEntity(props: Props, arc: Arc): Entity {
    return arc.dao(props.address);
  }

  entityContextSatisfied(props: Props): boolean {
    // no additional contextual information needed
    return true;
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

export default DAO;

export {
  Props as DAOProps,
  Entity as DAOEntity,
  Data as DAOData,
  Code as DAOCode,
  ComponentLogs
};
