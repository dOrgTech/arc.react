import * as React from "react";
import { Observable } from "rxjs";
import { IPluginQueryOptions as FilterOptions } from "@dorgtech/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  InferredPlugin as Component,
  PluginEntity as Entity,
  PluginData as Data,
  DAO,
  DAOEntity,
  CProps,
  ComponentList,
  ComponentListLogs,
  ComponentListProps,
  createFilterFromScope,
} from "../../";
import { CreateContextFeed } from "../../runtime/ContextFeed";

type Scopes = "DAO";

const scopeProps: Record<Scopes, string> = {
  DAO: "dao",
};

interface RequiredProps
  extends ComponentListProps<Entity, Data, FilterOptions> {
  from?: Scopes;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
  dao?: string | DAOEntity;
}

class InferredPlugins extends ComponentList<InferredProps, Component> {
  createObservableEntities(): Observable<Entity[]> {
    const { config, from, filter } = this.props;
    if (!config) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }

    const f = createFilterFromScope(filter, from, scopeProps, this.props);
    return Entity.search(config.connection, f);
  }

  renderComponent(
    entity: Entity,
    children: any,
    index: number
  ): React.ComponentElement<CProps<Component>, any> {
    const { config } = this.props;

    return (
      <Component key={`${entity.id}_${index}`} id={entity.id} config={config}>
        {children}
      </Component>
    );
  }

  public static get Entities() {
    return CreateContextFeed(
      this._EntitiesContext.Consumer,
      this._LogsContext.Consumer,
      "Plugins"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "Plugins"
    );
  }

  protected static _EntitiesContext = React.createContext<Entity[] | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<
    ComponentListLogs | undefined
  >(undefined);
}

class Plugins extends React.Component<RequiredProps> {
  render() {
    const { children, from, sort, filter } = this.props;

    return (
      <Protocol.Config>
        {(config: ProtocolConfig) => {
          switch (from) {
            case "DAO":
              return (
                <DAO.Entity>
                  {(dao: DAOEntity) => (
                    <InferredPlugins
                      dao={dao}
                      config={config}
                      sort={sort}
                      filter={filter}
                    >
                      {children}
                    </InferredPlugins>
                  )}
                </DAO.Entity>
              );
            default:
              if (from) {
                throw Error(`Unsupported scope: ${from}`);
              }

              return (
                <InferredPlugins config={config} sort={sort} filter={filter}>
                  {children}
                </InferredPlugins>
              );
          }
        }}
      </Protocol.Config>
    );
  }

  public static get Entities() {
    return InferredPlugins.Entities;
  }

  public static get Logs() {
    return InferredPlugins.Logs;
  }
}

export default Plugins;

export { Plugins, InferredPlugins };
