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
  Token as Entity,
  ITokenState as Data
} from "@daostack/client";

type Code = { }

interface RequiredProps extends BaseProps {
  // Address of the Token
  address: string;
}

interface InferredProps {
  // Arc Instance
  arcConfig: ArcConfig | undefined;
}

type Props = RequiredProps & InferredProps;

// TODO: DAOToken & DAOReputation
class ArcToken extends Component<Props, Entity, Data, Code>
{
  createEntity(): Entity {
    const { arcConfig, address } = this.props;
    if (!arcConfig) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }
    return new Entity(address, arcConfig.connection);
  }

  public static get Entity() {
    return CreateContextFeed(this._EntityContext.Consumer);
  }

  public static get Data() {
    return CreateContextFeed(this._DataContext.Consumer);
  }

  public static get Code() {
    return CreateContextFeed(this._CodeContext.Consumer);
  }

  public static get Logs() {
    return CreateContextFeed(this._LogsContext.Consumer);
  }

  protected static _EntityContext = React.createContext({ });
  protected static _DataContext   = React.createContext({ });
  protected static _CodeContext   = React.createContext({ });
  protected static _LogsContext   = React.createContext({ });
}

class Token extends React.Component<RequiredProps>
{
  render() {
    const { address, children } = this.props;

    return (
      <Arc.Config>
      {(arc: ArcConfig) => (
        <ArcToken address={address} arcConfig={arc}>
        {children}
        </ArcToken>
      )}
      </Arc.Config>
    );
  }

  public static get Entity() {
    return ArcToken.Entity;
  }

  public static get Data() {
    return ArcToken.Data;
  }

  public static get Code() {
    return ArcToken.Code;
  }

  public static get Logs() {
    return ArcToken.Logs;
  }
}

export default Token;

export {
  ArcToken,
  Token,
  Props as TokenProps,
  Entity as TokenEntity,
  Data as TokenData,
  Code as TokenCode,
  ComponentLogs
};
