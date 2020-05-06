import * as React from "react";
import {
  IPluginState as EntityData,
  SchemeRegistrarPlugin as Entity,
  AnyPlugin,
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

class InferredPluginManager extends Component<
  InferredProps,
  AnyPlugin,
  EntityData
> {
  protected async createEntity(): Promise<AnyPlugin> {
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
      "Plugin"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this._DataContext.Consumer,
      this._LogsContext.Consumer,
      "Plugin"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "Plugin"
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

class PluginManager extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;

    return (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredPluginManager id={id} config={config}>
            {children}
          </InferredPluginManager>
        )}
      </Protocol.Config>
    );
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

export { PluginManager, InferredPluginManager };
