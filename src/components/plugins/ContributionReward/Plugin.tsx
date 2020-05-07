import * as React from "react";
import {
  ContributionRewardPlugin as Entity,
  ProposalPlugin,
  IProposalCreateOptionsCR,
  IContributionRewardProposalState,
} from "@dorgtech/arc.js";
import { CreateContextFeed } from "../../../runtime/ContextFeed";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  Component,
  ComponentLogs,
  ComponentProps,
  PluginEntity,
  PluginData,
  Plugin,
} from "../../../";

interface RequiredProps extends ComponentProps {
  // Plugin ID
  id?: string | Entity;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
  id: string | Entity;
}

class InferredContributionReward extends Component<
  InferredProps,
  PluginEntity,
  PluginData
> {
  protected createEntity(): PluginEntity {
    const { config, id } = this.props;

    if (!config) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }

    const pluginId = typeof id === "string" ? id : id.id;
    return new Entity(config.connection, pluginId);
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
  protected static _DataContext = React.createContext<PluginData | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<
    ComponentLogs | undefined
  >(undefined);
}

class ContributionRewardPlugin extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;

    const renderInferred = (id: string | Entity) => (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredContributionReward id={id} config={config}>
            {children}
          </InferredContributionReward>
        )}
      </Protocol.Config>
    );

    if (!id) {
      return (
        <Plugin.Entity>
          {(plugin: PluginEntity) => renderInferred(plugin.id)}
        </Plugin.Entity>
      );
    } else {
      return renderInferred(id);
    }
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

export default ContributionRewardPlugin;

export {
  ContributionRewardPlugin,
  InferredContributionReward,
  Entity as ContributionRewardEntity,
};