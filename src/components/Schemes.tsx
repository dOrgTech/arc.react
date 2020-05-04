import * as React from "react";
import { Observable } from "rxjs";
import { ISchemeQueryOptions as FilterOptions } from "@daostack/client";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  InferredScheme as Component,
  SchemeEntity as Entity,
  SchemeData as Data,
  DAO,
  DAOEntity,
  CProps,
  ComponentList,
  ComponentListLogs,
  ComponentListProps,
  applyScope,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";

type Scopes = "DAO";

const scopeProps: Record<Scopes, string> = {
  DAO: "dao",
};

interface RequiredProps
  extends ComponentListProps<Entity, Data, FilterOptions> {
  scope?: Scopes;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
  dao?: string;
}

class InferredSchemes extends ComponentList<InferredProps, Component> {
  createObservableEntities(): Observable<Entity[]> {
    const { config, scope, filter } = this.props;
    if (!config) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }

    const f = applyScope(filter, scope, scopeProps, this.props);
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
      "Schemes"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "Schemes"
    );
  }

  protected static _EntitiesContext = React.createContext<Entity[] | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<
    ComponentListLogs | undefined
  >(undefined);
}

class Schemes extends React.Component<RequiredProps> {
  render() {
    const { children, scope, sort, filter } = this.props;

    return (
      <Protocol.Config>
        {(config: ProtocolConfig) => {
          switch (scope) {
            case "DAO":
              return (
                <DAO.Entity>
                  {(dao: DAOEntity) => (
                    <InferredSchemes
                      dao={dao.id}
                      config={config}
                      sort={sort}
                      filter={filter}
                    >
                      {children}
                    </InferredSchemes>
                  )}
                </DAO.Entity>
              );
            default:
              if (scope) {
                throw Error(`Unsupported scope: ${scope}`);
              }

              return (
                <InferredSchemes config={config} sort={sort} filter={filter}>
                  {children}
                </InferredSchemes>
              );
          }
        }}
      </Protocol.Config>
    );
  }

  public static get Entities() {
    return InferredSchemes.Entities;
  }

  public static get Logs() {
    return InferredSchemes.Logs;
  }
}

export default Schemes;

export { Schemes };
