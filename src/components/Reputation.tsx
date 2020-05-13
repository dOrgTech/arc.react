import * as React from "react";
import {
  Reputation as Entity,
  IReputationState as Data,
} from "@dorgtech/arc.js";
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
  // Address of the Reputation Token
  address?: string;
}

interface InferredProps extends RequiredProps {
  // Arc Instance
  config: ProtocolConfig | undefined;
}

class InferredReputation extends Component<InferredProps, Entity, Data> {
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
      "Reputation"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this.DataContext.Consumer,
      this.LogsContext.Consumer,
      "Reputation"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this.LogsContext.Consumer,
      this.LogsContext.Consumer,
      "Reputation"
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

function useReputation(): [Data | undefined, Entity | undefined] {
  const data = React.useContext<Data | undefined>(
    InferredReputation.DataContext
  );
  const entity = React.useContext<Entity | undefined>(
    InferredReputation.EntityContext
  );

  return [data, entity];
}

class Reputation extends React.Component<RequiredProps> {
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
              <InferComponent.Data>
                {(dao: InferData) => (
                  <InferredReputation
                    address={dao ? dao.reputation.id : undefined}
                    config={config}
                  >
                    {children}
                  </InferredReputation>
                )}
              </InferComponent.Data>
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
  useReputation,
};
