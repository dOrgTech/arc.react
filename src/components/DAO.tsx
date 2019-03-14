import { Component } from "./Component";
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

export default class DAO extends Component<Props, Entity, Data, Code>
{
  createEntity(props: Props, arc: Arc): Entity {
    return arc.dao(props.address);
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

export {
  Props as DAOProps,
  Entity as DAOEntity,
  Data as DAOData,
  Code as DAOCode,
};

// Ideal usage
/*
/// DAO.Data
<DAO address="0x34234234">
  <DAO.Data>
    {dao => (
      <div>{dao.name}</div>
      <div>{dao.callSomeView(sdfsdf)}</div>
    )}
  </DAO.Data>
</DAO>
*/

/*
/// DAO.Code
<DAO address="0x34234234">
  <DAO.Code>
    {code => await code.createProposal(...)}
  </DAO.Code>
</DAO>
*/

/*
/// DAO Everything
<DAO address="0x34234234">
{
  (data, code) => (
    <div>{graph.name}</div>
  )
}
</DAO>
*/

// TODO: long term, only have read & write semantics. read (props & funcs / transforms)

// - only address a user should be expected to give is the DAO avatar address
// - all other addresses are gotten from the semantic graph...
/*interface ViewMethods
{
  test(value: string): boolean,
  something(something: string): string
};

interface ActionMethods {
  test: (value: number) => string
};*/
