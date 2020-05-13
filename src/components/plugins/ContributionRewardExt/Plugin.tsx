import * as React from "react";
import {
  ContributionRewardExtPlugin as Entity,
  IContributionRewardExtState as Data,
} from "@dorgtech/arc.js";
import { CreateContextFeed } from "../../../runtime/ContextFeed";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  Component,
  ComponentLogs,
  ComponentProps,
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

class InferredContributionRewardExtPlugin extends Component<
  InferredProps,
  Entity,
  Data
> {
  protected createEntity(): Entity {
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
      this.EntityContext.Consumer,
      this.LogsContext.Consumer,
      "ContributionRewardExtPlugin"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this.DataContext.Consumer,
      this.LogsContext.Consumer,
      "ContributionRewardExtPlugin"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this.LogsContext.Consumer,
      this.LogsContext.Consumer,
      "ContributionRewardExtPlugin"
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

function useContributionRewardExtPlugin(): [
  Data | undefined,
  Entity | undefined
] {
  const data = React.useContext<Data | undefined>(
    InferredContributionRewardExtPlugin.DataContext
  );
  const entity = React.useContext<Entity | undefined>(
    InferredContributionRewardExtPlugin.EntityContext
  );

  return [data, entity];
}

class ContributionRewardExtPlugin extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;

    const renderInferred = (id: string | Entity) => (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredContributionRewardExtPlugin id={id} config={config}>
            {children}
          </InferredContributionRewardExtPlugin>
        )}
      </Protocol.Config>
    );

    if (!id) {
      return (
        <Plugin.Entity>
          {(plugin: Entity) => renderInferred(plugin.id)}
        </Plugin.Entity>
      );
    } else {
      return renderInferred(id);
    }
  }

  public static get Entity() {
    return InferredContributionRewardExtPlugin.Entity;
  }

  public static get Data() {
    return InferredContributionRewardExtPlugin.Data;
  }

  public static get Logs() {
    return InferredContributionRewardExtPlugin.Logs;
  }
}

export default ContributionRewardExtPlugin;

export {
  ContributionRewardExtPlugin,
  InferredContributionRewardExtPlugin,
  Entity as ContributionRewardExtPluginEntity,
  Data as ContributionRewardExtPluginData,
  useContributionRewardExtPlugin,
};
