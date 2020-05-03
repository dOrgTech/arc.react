import * as React from "react";
import { Token as Entity, ITokenState as Data } from "@daostack/client";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  DAO as InferComponent,
  DAOData as InferData,
  Component,
  ComponentLogs,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";

interface RequiredProps {
  // Address of the Token
  address?: string;
}

interface InferredProps {
  // Arc Instance
  arcConfig: ProtocolConfig | undefined;
}

type Props = RequiredProps & InferredProps;

class ArcToken extends Component<Props, Entity, Data> {
  protected createEntity(): Entity {
    const { arcConfig, address } = this.props;
    if (!arcConfig) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }
    if (!address) {
      throw Error(
        "Address Missing: Please provide this field as a prop, or use the inference component."
      );
    }
    return new Entity(address, arcConfig.connection);
  }

  public static get Entity() {
    return CreateContextFeed(
      this._EntityContext.Consumer,
      this._LogsContext.Consumer,
      "Token"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this._DataContext.Consumer,
      this._LogsContext.Consumer,
      "Token"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "Token"
    );
  }

  protected static _EntityContext = React.createContext<Entity | undefined>(
    undefined
  );
  protected static _DataContext = React.createContext<Data | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<
    ComponentLogs | undefined
  >(undefined);
}

class Token extends React.Component<RequiredProps> {
  public render() {
    const { address, children } = this.props;

    if (address !== undefined) {
      return (
        <Protocol.Config>
          {(arc: ProtocolConfig) => (
            <ArcToken address={address} arcConfig={arc}>
              {children}
            </ArcToken>
          )}
        </Protocol.Config>
      );
    } else {
      return (
        <Protocol.Config>
          <InferComponent.Data>
            {(arc: ProtocolConfig, dao: InferData) => (
              <ArcToken address={dao.token.address} arcConfig={arc}>
                {children}
              </ArcToken>
            )}
          </InferComponent.Data>
        </Protocol.Config>
      );
    }
  }

  public static get Entity() {
    return ArcToken.Entity;
  }

  public static get Data() {
    return ArcToken.Data;
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
};
