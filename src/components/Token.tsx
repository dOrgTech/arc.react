import * as React from "react";
import { Token as Entity, ITokenState as Data } from "@dorgtech/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  DAO as InferComponent,
  DAOData as InferData,
  Component,
  ComponentLogs,
  ComponentProps,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";

interface RequiredProps extends ComponentProps {
  // Address of the Token
  address?: string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredToken extends Component<InferredProps, Entity, Data> {
  protected createEntity(props: InferredProps): Entity {
    const { config, address } = props;
    if (!config) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }
    if (!address) {
      throw Error(
        "Address Missing: Please provide this field as a prop, or use the inference component."
      );
    }
    return new Entity(config.connection, address);
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
            <InferredToken address={address} config={arc}>
              {children}
            </InferredToken>
          )}
        </Protocol.Config>
      );
    } else {
      return (
        <Protocol.Config>
          <InferComponent.Data>
            {(arc: ProtocolConfig, dao: InferData) => (
              <InferredToken address={dao.token.id} config={arc}>
                {children}
              </InferredToken>
            )}
          </InferComponent.Data>
        </Protocol.Config>
      );
    }
  }

  public static get Entity() {
    return InferredToken.Entity;
  }

  public static get Data() {
    return InferredToken.Data;
  }

  public static get Logs() {
    return InferredToken.Logs;
  }
}

export default Token;

export { Token, InferredToken, Entity as TokenEntity, Data as TokenData };
