import * as React from "react";
import { first } from "rxjs/operators";
import {
  Plugin as BaseEntity,
  IPluginState as BaseData,
} from "@dorgtech/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  Component,
  ComponentProps,
  ComponentLogs,
} from "../../";
import { CreateContextFeed } from "../../runtime/ContextFeed";

abstract class Entity extends BaseEntity<BaseData> {}
type Data = BaseData;

interface RequiredProps extends ComponentProps<Entity, Data> {
  // Plugin ID
  id: Entity | string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredPlugin extends Component<InferredProps, Entity, Data> {
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
      const plugin = await Entity.search(config.connection, { where: { id } })
        .pipe(first())
        .toPromise();

      if (!plugin || plugin.length === 0) {
        throw Error("Plugin not found");
      }

      return plugin[0];
    } else {
      return id;
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

export { Plugin, InferredPlugin, Entity as PluginEntity, Data as PluginData };
