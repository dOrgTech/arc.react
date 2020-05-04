import * as React from "react";
import { Observable } from "rxjs";
import { IMemberQueryOptions as FilterOptions } from "@daostack/client";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  DAO as InferComponent,
  DAOEntity as InferEntity,
  InferredMember as Component,
  MemberEntity as Entity,
  MemberData as Data,
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

class InferredMembers extends ComponentList<InferredProps, Component> {
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

    // TODO: support creating Components with just an Entity, it makes no sense to recreate the Member entity here...
    return (
      <Component
        key={`${entity.id}_${index}`}
        address={entity.staticState!.address}
        dao={entity.staticState!.dao}
        config={config}
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
    const { children, scope, sort, filter } = this.props;

    return (
      <Protocol.Config>
        {(config: ProtocolConfig) => {
          switch (scope) {
            case "DAO":
              return (
                <InferComponent.Entity>
                  {(dao: InferEntity) => (
                    <InferredMembers
                      dao={dao.id}
                      config={config}
                      sort={sort}
                      filter={filter}
                    >
                      {children}
                    </InferredMembers>
                  )}
                </InferComponent.Entity>
              );
            default:
              if (scope) {
                throw Error(`Unsupported scope: ${scope}`);
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

export { Members };
