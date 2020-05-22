import * as React from "react";
import { CreateContextFeed } from "../runtime/ContextFeed";
import { Reward as Entity, IRewardState as Data } from "@dorgtech/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  Component,
  ComponentLogs,
  ComponentProps,
} from "../";

interface RequiredProps extends ComponentProps<Entity, Data> {
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

    return new Entity(config.connection, id);
  }

  public static get Entity() {
    return CreateContextFeed(
      this.EntityContext.Consumer,
      this.LogsContext.Consumer,
      "Reward"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this.DataContext.Consumer,
      this.LogsContext.Consumer,
      "Reward"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this.LogsContext.Consumer,
      this.LogsContext.Consumer,
      "Reward"
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

function useReward(): [Data | undefined, Entity | undefined] {
  const data = React.useContext<Data | undefined>(InferredReward.DataContext);
  const entity = React.useContext<Entity | undefined>(
    InferredReward.EntityContext
  );

  return [data, entity];
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

export {
  Reward,
  InferredReward,
  Entity as RewardEntity,
  Data as RewardData,
  useReward,
};
