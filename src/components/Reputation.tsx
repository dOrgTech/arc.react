import * as React from "react";
import {
  Reputation as Entity,
  IReputationState as Data,
} from "@daostack/client";
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
  // Address of the Reputation Token
  address?: string;
}

interface InferredProps {
  // Arc Instance
  arcConfig: ProtocolConfig | undefined;
}

type Props = RequiredProps & InferredProps;

class ArcReputation extends Component<Props, Entity, Data> {
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
      "Reputation"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this._DataContext.Consumer,
      this._LogsContext.Consumer,
      "Reputation"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "Reputation"
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

class Reputation extends React.Component<RequiredProps> {
  public render() {
    const { address, children } = this.props;

    if (address !== undefined) {
      return (
        <Protocol.Config>
          {(arc: ProtocolConfig) => (
            <ArcReputation address={address} arcConfig={arc}>
              {children}
            </ArcReputation>
          )}
        </Protocol.Config>
      );
    } else {
      return (
        <Protocol.Config>
          <InferComponent.Data>
            {(arc: ProtocolConfig, dao: InferData) => (
              <ArcReputation address={dao.reputation.address} arcConfig={arc}>
                {children}
              </ArcReputation>
            )}
          </InferComponent.Data>
        </Protocol.Config>
      );
    }
  }

  public static get Entity() {
    return ArcReputation.Entity;
  }

  public static get Data() {
    return ArcReputation.Data;
  }

  public static get Logs() {
    return ArcReputation.Logs;
  }
}

export default Reputation;

export {
  ArcReputation,
  Reputation,
  Props as ReputationProps,
  Entity as ReputationEntity,
  Data as ReputationData,
};
