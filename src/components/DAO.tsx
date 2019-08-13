import * as React from "react";
import {
  Component,
  ComponentLogs,
  BaseProps,
} from "../runtime";
import {
  CreateContextFeed
} from "../runtime/ContextFeed";
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

interface RequiredProps extends BaseProps {
  // Address of the DAO Avatar
  address: string;
}

interface InferredProps {
  // Arc Instance
  arcConfig: ArcConfig | undefined;
}

type Props = RequiredProps & InferredProps;

class ArcDAO extends Component<Props, Entity, Data, Code>
{
  protected createEntity(): Entity {
    const { arcConfig, address } = this.props;
    if (!arcConfig) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }
    return new Entity(address, arcConfig.connection);
  }

  protected async initialize(entity: Entity | undefined): Promise<void> {
    if (entity) {
      await entity.fetchStaticState();
    }

    return Promise.resolve();
  }

  public static get Entity() {
    return CreateContextFeed(this._EntityContext.Consumer, this._LogsContext.Consumer);
  }

  public static get Data() {
    return CreateContextFeed(this._DataContext.Consumer, this._LogsContext.Consumer);
  }

  public static get Code() {
    return CreateContextFeed(this._CodeContext.Consumer, this._LogsContext.Consumer);
  }

  public static get Logs() {
    return CreateContextFeed(this._LogsContext.Consumer, this._LogsContext.Consumer);
  }

  protected static _EntityContext = React.createContext({ });
  protected static _DataContext   = React.createContext({ });
  protected static _CodeContext   = React.createContext({ });
  protected static _LogsContext   = React.createContext({ });
}

class DAO extends React.Component<RequiredProps>
{
  public render() {
    const { address, children } = this.props;

    return (
      <Arc.Config>
      {(arc: ArcConfig) => (
        <ArcDAO address={address} arcConfig={arc}>
        {children}
        </ArcDAO>
      )}
      </Arc.Config>
    );
  }

  public static get Entity() {
    return ArcDAO.Entity;
  }

  public static get Data() {
    return ArcDAO.Data;
  }

  public static get Code() {
    return ArcDAO.Code;
  }

  public static get Logs() {
    return ArcDAO.Logs;
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
