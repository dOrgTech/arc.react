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
  DAO,
  DAOData
} from "./";
import {
  Reputation as Entity,
  IReputationState as Data
} from "@daostack/client";

type Code = { }

interface RequiredProps extends BaseProps {
  // Address of the Reputation Token
  address?: string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredReputation extends Component<InferredProps, Entity, Data, Code>
{
  protected createEntity(): Entity {
    const { config, address } = this.props;

    if (!address) {
      throw Error("Address Missing: Please provide this field as a prop, or use the inference component.")
    }

    return new Entity(address, config.connection);
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

class Reputation extends React.Component<RequiredProps>
{
  public render() {
    const { address, children } = this.props;

    return (
      <Protocol.Config>
      {(config: ProtocolConfig) => {
        if (address) {
          return (
            <InferredReputation address={address} config={config}>
            {children}
            </InferredReputation>
          );
        } else {
          return (
            <DAO.Data>
            {(dao: DAOData) => (
              <InferredReputation address={dao.reputation.address} config={config}>
              {children}
              </InferredReputation>
            )}
            </DAO.Data>
          );
        }
      }}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return InferredReputation.Entity;
  }

  public static get Data() {
    return InferredReputation.Data;
  }

  public static get Code() {
    return InferredReputation.Code;
  }

  public static get Logs() {
    return InferredReputation.Logs;
  }
}

export default Reputation;

export {
  Reputation,
  InferredReputation,
  Entity as ReputationEntity,
  Data as ReputationData,
  Code as ReputationCode,
  ComponentLogs
};
