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
} from "./DAO";
import {
  Token as Entity,
  ITokenState as Data
} from "@daostack/client";

type Code = { }

interface RequiredProps extends BaseProps {
  // Address of the Token
  address?: string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredToken extends Component<InferredProps, Entity, Data, Code>
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

class Token extends React.Component<RequiredProps>
{
  public render() {
    const { address, children } = this.props;

    return (
      <Protocol.Config>
      {(config: ProtocolConfig) => {
        if (address) {
          return (
            <InferredToken address={address} config={config}>
            {children}
            </InferredToken>
          );
        } else {
          return (
            <DAO.Data noLoad>
            {(dao: DAOData | undefined) => (
              <InferredToken address={dao ? dao.token.address : undefined} config={config}>
              {children}
              </InferredToken>
            )}
            </DAO.Data>
          );
        }
      }}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return InferredToken.Entity;
  }

  public static get Data() {
    return InferredToken.Data;
  }

  public static get Code() {
    return InferredToken.Code;
  }

  public static get Logs() {
    return InferredToken.Logs;
  }
}

export default Token;

export {
  Token,
  InferredToken,
  Entity as TokenEntity,
  Data as TokenData,
  Code as TokenCode,
  ComponentLogs
};
