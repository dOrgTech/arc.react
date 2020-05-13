import * as React from "react";
import {
  JoinAndQuit as Entity,
  IJoinAndQuitState as Data,
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

class InferredJoinAndQuitPlugin extends Component<InferredProps, Entity, Data> {
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
      "JoinAndQuitPlugin"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this.DataContext.Consumer,
      this.LogsContext.Consumer,
      "JoinAndQuitPlugin"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this.LogsContext.Consumer,
      this.LogsContext.Consumer,
      "JoinAndQuitPlugin"
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

function useJoinAndQuitPlugin(): [Data | undefined, Entity | undefined] {
  const data = React.useContext<Data | undefined>(
    InferredJoinAndQuitPlugin.DataContext
  );
  const entity = React.useContext<Entity | undefined>(
    InferredJoinAndQuitPlugin.EntityContext
  );

  return [data, entity];
}

class JoinAndQuitPlugin extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;

    const renderInferred = (id: string | Entity) => (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredJoinAndQuitPlugin id={id} config={config}>
            {children}
          </InferredJoinAndQuitPlugin>
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
    return InferredJoinAndQuitPlugin.Entity;
  }

  public static get Data() {
    return InferredJoinAndQuitPlugin.Data;
  }

  public static get Logs() {
    return InferredJoinAndQuitPlugin.Logs;
  }
}

export default JoinAndQuitPlugin;

export {
  JoinAndQuitPlugin,
  InferredJoinAndQuitPlugin,
  Entity as JoinAndQuitPluginEntity,
  Data as JoinAndQuitPluginData,
  useJoinAndQuitPlugin,
};
