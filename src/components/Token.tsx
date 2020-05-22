import * as React from "react";
import { Token as Entity, ITokenState as Data } from "@daostack/arc.js";
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

interface RequiredProps extends ComponentProps<Entity, Data> {
  // Address of the Token
  address?: string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredToken extends Component<InferredProps, Entity, Data> {
  protected createEntity(): Entity {
    const { config, address } = this.props;
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
      this.EntityContext.Consumer,
      this.LogsContext.Consumer,
      "Token"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this.DataContext.Consumer,
      this.LogsContext.Consumer,
      "Token"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this.LogsContext.Consumer,
      this.LogsContext.Consumer,
      "Token"
    );
  }

  public static EntityContext = React.createContext<Entity | undefined>(
    undefined
  );
  public static DataContext = React.createContext<Data | undefined>(undefined);
  public static LogsContext = React.createContext<ComponentLogs | undefined>(
    undefined
  );
}

function useToken(): [Data | undefined, Entity | undefined] {
  const data = React.useContext<Data | undefined>(InferredToken.DataContext);
  const entity = React.useContext<Entity | undefined>(
    InferredToken.EntityContext
  );

  return [data, entity];
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

export {
  Token,
  InferredToken,
  Entity as TokenEntity,
  Data as TokenData,
  useToken,
};
