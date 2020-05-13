import * as React from "react";
import {
  SchemeRegistrarPlugin as Entity,
  ISchemeRegistrarState as Data,
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

class InferredSchemeRegistrarPlugin extends Component<
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
      "SchemeRegistrarPlugin"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this.DataContext.Consumer,
      this.LogsContext.Consumer,
      "SchemeRegistrarPlugin"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this.LogsContext.Consumer,
      this.LogsContext.Consumer,
      "SchemeRegistrarPlugin"
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

function useSchemeRegistrarPlugin(): [Data | undefined, Entity | undefined] {
  const data = React.useContext<Data | undefined>(
    InferredSchemeRegistrarPlugin.DataContext
  );
  const entity = React.useContext<Entity | undefined>(
    InferredSchemeRegistrarPlugin.EntityContext
  );

  return [data, entity];
}

class SchemeRegistrarPlugin extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;

    const renderInferred = (id: string | Entity) => (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredSchemeRegistrarPlugin id={id} config={config}>
            {children}
          </InferredSchemeRegistrarPlugin>
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
    return InferredSchemeRegistrarPlugin.Entity;
  }

  public static get Data() {
    return InferredSchemeRegistrarPlugin.Data;
  }

  public static get Logs() {
    return InferredSchemeRegistrarPlugin.Logs;
  }
}

export default SchemeRegistrarPlugin;

export {
  SchemeRegistrarPlugin,
  InferredSchemeRegistrarPlugin,
  Entity as SchemeRegistrarPluginEntity,
  Data as SchemeRegistrarPluginData,
  useSchemeRegistrarPlugin,
};
