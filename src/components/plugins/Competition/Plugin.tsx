import * as React from "react";
import {
  IPluginState as EntityData,
  Plugin as BaseEntity,
  ContributionRewardPlugin as Entity,
} from "@dorgtech/arc.js";
import { CreateContextFeed } from "../../../runtime/ContextFeed";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  Component,
  ComponentLogs,
  ComponentProps,
} from "../../../";

interface RequiredProps extends ComponentProps {
  // Plugin ID
  id: string;
  type?: string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredContributionReward extends Component<
  InferredProps,
  BaseEntity<EntityData>,
  EntityData
> {
  protected createEntity(): BaseEntity<EntityData> {
    const { config, id } = this.props;

    if (!config) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }

    return new Entity(config.connection, id);
  }

  public static get Entity() {
    return CreateContextFeed(
      this._EntityContext.Consumer,
      this._LogsContext.Consumer,
      "CompetitionPlugin"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this._DataContext.Consumer,
      this._LogsContext.Consumer,
      "CompetitionPlugin"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "CompetitionPlugin"
    );
  }

  protected static _EntityContext = React.createContext<Entity | undefined>(
    undefined
  );
  protected static _DataContext = React.createContext<EntityData | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<
    ComponentLogs | undefined
  >(undefined);
}

class ContributionRewardPlugin extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;

    return (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredContributionReward id={id} config={config}>
            {children}
          </InferredContributionReward>
        )}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return InferredContributionReward.Entity;
  }

  public static get Data() {
    return InferredContributionReward.Data;
  }

  public static get Logs() {
    return InferredContributionReward.Logs;
  }
}

export default Plugin;

export {
  ContributionRewardPlugin,
  InferredContributionReward,
  EntityData as PluginData,
};
