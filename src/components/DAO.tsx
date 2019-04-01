import * as React from "react";
import {
  Component,
  ComponentLogs,
  BaseProps,
  Logging
} from "../runtime";
import {
  Arc,
  ArcConfig
} from "../protocol";
import {
  DAO as Entity,
  IDAOState as Data
} from "@daostack/client";

// TODO: thought:
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

interface RequiredProps {
  // Address of the DAO Avatar
  address: string;
}

interface InferredProps {
  // TODO: should this really be optional? It makes more sense from a user perspective to have it be required
  // Arc Instance
  arcConfig?: ArcConfig;
}

type Props = RequiredProps & InferredProps & BaseProps;

class ArcDAO extends Component<Props, Entity, Data, Code>
{
  createEntity(): Entity {
    const { arcConfig, address } = this.props;
    if (!arcConfig) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }
    return arcConfig.connection.dao(address);
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

class DAO extends React.Component<RequiredProps>
{
  render() {
    const { address, children } = this.props;

    return (
      <Logging.Config>
      {logging => (
        <Arc.Config>
        {arc => (
          <ArcDAO address={address} arcConfig={arc} loggingConfig={logging}>
          {children}
          </ArcDAO>
        )}
        </Arc.Config>
      )}
      </Logging.Config>
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

export default DAO;

export {
  ArcDAO,
  DAO,
  Props as DAOProps,
  Entity as DAOEntity,
  Data as DAOData,
  Code as DAOCode,
  ComponentLogs
};
