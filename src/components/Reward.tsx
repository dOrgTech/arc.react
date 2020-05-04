import * as React from "react";
import { Reward as Entity, IRewardState as Data } from "@daostack/client";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  Component,
  ComponentLogs,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";

interface RequiredProps {
  // Reward ID
  id: string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredReward extends Component<InferredProps, Entity, Data> {
  protected createEntity(): Entity {
    const { id, config } = this.props;

    if (!config) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }

    return new Entity(id, config.connection);
  }

  public static get Entity() {
    return CreateContextFeed(
      this._EntityContext.Consumer,
      this._LogsContext.Consumer,
      "Reward"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this._DataContext.Consumer,
      this._LogsContext.Consumer,
      "Reward"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "Reward"
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

class Reward extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;

    return (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredReward id={id} config={config}>
            {children}
          </InferredReward>
        )}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return InferredReward.Entity;
  }

  public static get Data() {
    return InferredReward.Data;
  }

  public static get Logs() {
    return InferredReward.Logs;
  }
}

export default Reward;

export { Reward, InferredReward, Entity as RewardEntity, Data as RewardData };
