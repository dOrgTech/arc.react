import * as React from "react";
import { Observable } from "rxjs";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  DAO,
  DAOEntity,
  InferredMember as Component,
  MemberEntity as Entity,
  MemberData as Data,
  CProps,
  ComponentList,
  ComponentListLogs,
  ComponentListProps,
  createFilterFromScope,
} from "../";
import { IMemberQueryOptions as FilterOptions } from "@dorgtech/arc.js";
import { CreateContextFeed } from "../runtime/ContextFeed";

type Scopes = "DAO";

const scopeProps: Record<Scopes, string> = {
  DAO: "dao",
};

interface RequiredProps extends ComponentListProps<Entity, FilterOptions> {
  from?: Scopes;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
  dao?: string;
}

class InferredMembers extends ComponentList<InferredProps, Component> {
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

    // TODO: support creating Components with just an Entity, it makes no sense to recreate the Member entity here...
    return (
      <Component
        key={`${entity.id}_${index}`}
        address={entity.coreState!.address}
        dao={entity.coreState!.dao.entity}
        config={config}
        entity={entity}
      >
        {children}
      </Component>
    );
  }

  public static get Entities() {
    return CreateContextFeed(
      this._EntitiesContext.Consumer,
      this._LogsContext.Consumer,
      "Members"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "Members"
    );
  }

  protected static _EntitiesContext = React.createContext<Entity[] | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<
    ComponentListLogs | undefined
  >(undefined);
}

class Members extends React.Component<RequiredProps> {
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
                    <InferredMembers
                      dao={dao.id}
                      config={config}
                      sort={sort}
                      filter={filter}
                    >
                      {children}
                    </InferredMembers>
                  )}
                </DAO.Entity>
              );
            default:
              if (from) {
                throw Error(`Unsupported scope: ${from}`);
              }

              return (
                <InferredMembers config={config} sort={sort} filter={filter}>
                  {children}
                </InferredMembers>
              );
          }
        }}
      </Protocol.Config>
    );
  }

  public static get Entities() {
    return InferredMembers.Entities;
  }

  public static get Logs() {
    return InferredMembers.Logs;
  }
}

export default Members;

export { Members, InferredMembers };
