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
  Arc as Protocol,
  ArcConfig as ProtocolConfig
} from "../protocol";
import {
  DAO as Entity,
  IDAOState as Data
} from "@daostack/client";

// TODO: remove code and just have user use entity
type Code = { }

interface RequiredProps extends BaseProps {
  // Address of the DAO Avatar
  address: string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig | undefined;
}

class InferredDAO extends Component<InferredProps, Entity, Data, Code>
{
  protected createEntity(): Entity {
    const { config, address } = this.props;

    if (!config) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }

    return new Entity(address, config.connection);
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
      <Protocol.Config>
      {(config: ProtocolConfig) => (
        <InferredDAO address={address} config={config}>
        {children}
        </InferredDAO>
      )}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return InferredDAO.Entity;
  }

  public static get Data() {
    return InferredDAO.Data;
  }

  public static get Code() {
    return InferredDAO.Code;
  }

  public static get Logs() {
    return InferredDAO.Logs;
  }
}

export default DAO;

export {
  DAO,
  InferredDAO,
  Entity as DAOEntity,
  Data as DAOData,
  Code as DAOCode,
  ComponentLogs
};
