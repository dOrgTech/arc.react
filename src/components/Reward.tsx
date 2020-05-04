import * as React from "react";
import { CreateContextFeed } from "../runtime/ContextFeed";
import { Reward as Entity, IRewardState as Data } from "@dorgtech/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  Component,
  ComponentLogs,
} from "../";

interface RequiredProps {
  // Reward ID
  id: string;
}

interface InferredProps {
  // Arc Instance
  arcConfig: ProtocolConfig | undefined;
}

type Props = RequiredProps & InferredProps;

class ArcReward extends Component<Props, Entity, Data> {
  protected createEntity(): Entity {
    const { id, arcConfig } = this.props;

    if (!arcConfig) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }

    return new Entity(arcConfig.connection, id);
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
        {(arc: ProtocolConfig) => (
          <ArcReward id={id} arcConfig={arc}>
            {children}
          </ArcReward>
        )}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return ArcReward.Entity;
  }

  public static get Data() {
    return ArcReward.Data;
  }

  public static get Logs() {
    return ArcReward.Logs;
  }
}

export default Reward;

export {
  ArcReward,
  Reward,
  Props as RewardProps,
  Entity as RewardEntity,
  Data as RewardData,
};
