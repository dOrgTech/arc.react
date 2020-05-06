import * as React from "react";
import { first } from "rxjs/operators";
import {
  Plugin as BaseEntity,
  IPluginState as BaseData,
  AnyPlugin,
} from "@dorgtech/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  Component,
  ComponentProps,
  ComponentLogs,
} from "../../";
import { CreateContextFeed } from "../../runtime/ContextFeed";

interface RequiredProps extends ComponentProps {
  // Plugin ID
  id: AnyPlugin | string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredPlugin<
  Entity extends BaseEntity<Data>,
  Data extends BaseData
> extends Component<InferredProps, Entity, Data> {
  protected async createEntity(): Promise<Entity> {
    const { config, id } = this.props;

    if (!config) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }

    if (!id) {
      throw Error(
        "ID Missing: Please provide this field as a prop, or use the inference component"
      );
    }

    if (typeof id === "string") {
      const plugins = BaseEntity.search(config.connection, { where: { id } });
      if (!plugins) throw Error("Plugin not found");
      const getPlugin = await plugins.pipe(first()).toPromise();
      return getPlugin[0] as Entity;
    } else {
      return id as Entity;
    }
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

  protected static _EntityContext = React.createContext<AnyPlugin | undefined>(
    undefined
  );
  protected static _DataContext = React.createContext<BaseData | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<
    ComponentLogs | undefined
  >(undefined);
}

class Plugin extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;
    return (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredPlugin id={id} config={config}>
            {children}
          </InferredPlugin>
        )}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return InferredPlugin.Entity;
  }

  public static get Data() {
    return InferredPlugin.Data;
  }

  public static get Logs() {
    return InferredPlugin.Logs;
  }
}

export default Plugin;

export {
  Plugin,
  InferredPlugin,
  BaseEntity as PluginEntity,
  BaseData as PluginData,
};
