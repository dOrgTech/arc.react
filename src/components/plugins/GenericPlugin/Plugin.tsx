import * as React from "react";
import {
  IPluginState as EntityData,
  CompetitionPlugin as Entity,
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

class InferredGenericPlugin extends Component<
  InferredProps,
  Entity,
  EntityData
> {
  protected async createEntity(): Promise<Entity> {
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

class GenericPlugin extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;

    return (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredGenericPlugin id={id} config={config}>
            {children}
          </InferredGenericPlugin>
        )}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return InferredGenericPlugin.Entity;
  }

  public static get Data() {
    return InferredGenericPlugin.Data;
  }

  public static get Logs() {
    return InferredGenericPlugin.Logs;
  }
}

export default GenericPlugin;

export { GenericPlugin, InferredGenericPlugin, EntityData as PluginData };
