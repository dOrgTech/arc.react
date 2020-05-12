import * as React from "react";
import { SchemeRegistrarPlugin as Entity } from "@dorgtech/arc.js";
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

interface RequiredProps extends ComponentProps<Entity, Data> {
  // Plugin ID
  id?: string | Entity;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
  id: string | Entity;
}

class InferredPluginManager extends Component<
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
      "PluginManager"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this._DataContext.Consumer,
      this._LogsContext.Consumer,
      "PluginManager"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "PluginManager"
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

class PluginManager extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;

    const renderInferred = (id: string | Entity) => (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredPluginManager id={id} config={config}>
            {children}
          </InferredPluginManager>
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
    return InferredPluginManager.Entity;
  }

  public static get Data() {
    return InferredPluginManager.Data;
  }

  public static get Logs() {
    return InferredPluginManager.Logs;
  }
}

export default PluginManager;

export { PluginManager, InferredPluginManager, Entity as PluginManagerEntity };
