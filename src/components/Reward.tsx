import * as React from "react";
import { Component, ComponentLogs } from "../runtime";
import { CreateContextFeed } from "../runtime/ContextFeed";
import { Arc, ArcConfig } from "../protocol";
import { Reward as Entity, IRewardState as Data } from "@daostack/client";

interface RequiredProps {
  // Reward ID
  id: string;
}

interface InferredProps {
  // Arc Instance
  arcConfig: ArcConfig | undefined;
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

    return new Entity(id, arcConfig.connection);
  }

  public static get Entity() {
    return CreateContextFeed(
      this._EntityContext.Consumer,
      this._LogsContext.Consumer
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this._DataContext.Consumer,
      this._LogsContext.Consumer
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer
    );
  }

  protected static _EntityContext = React.createContext<{} | undefined>(
    undefined
  );
  protected static _DataContext = React.createContext<{} | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<{} | undefined>({});
}

class Reward extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;

    return (
      <Arc.Config>
        {(arc: ArcConfig) => (
          <ArcReward id={id} arcConfig={arc}>
            {children}
          </ArcReward>
        )}
      </Arc.Config>
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
  ComponentLogs,
};
