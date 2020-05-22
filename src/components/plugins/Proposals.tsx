import * as React from "react";
import { Observable } from "rxjs";
import { IProposalQueryOptions as FilterOptions } from "@dorgtech/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  DAO,
  DAOEntity,
  Member,
  MemberEntity,
  InferredProposal as Component,
  ProposalEntity as Entity,
  CProps,
  ComponentList,
  ComponentListLogs,
  ComponentListProps,
  createFilterFromScope,
  PluginEntity,
  Plugin,
} from "../../";
import { CreateContextFeed } from "../../runtime/ContextFeed";

// TODO: @cesar add tag entity + "Tag" scope
type Scopes = "DAO" | "Member as proposer" | "Plugin" /* | "Tag" */;

const scopeProps: Record<Scopes, string> = {
  DAO: "dao",
  "Member as proposer": "proposer",
  Plugin: "plugin",
  // Tag: "tags_contains"
};

interface RequiredProps extends ComponentListProps<Entity, FilterOptions> {
  from?: Scopes;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
  dao?: string;
  proposer?: string;
  plugin?: string;
}

class InferredProposals extends ComponentList<InferredProps, Component> {
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
    return (
      <Component
        key={`${entity.id}_${index}`}
        id={entity.id}
        config={this.props.config}
        entity={entity}
      >
        {children}
      </Component>
    );
  }

  public static get Entities() {
    return CreateContextFeed(
      this.EntitiesContext.Consumer,
      this.LogsContext.Consumer,
      "Proposals"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this.LogsContext.Consumer,
      this.LogsContext.Consumer,
      "Proposals"
    );
  }

  protected static EntitiesContext = React.createContext<Entity[] | undefined>(
    undefined
  );
  protected static LogsContext = React.createContext<
    ComponentListLogs | undefined
  >(undefined);
}

class Proposals extends React.Component<RequiredProps> {
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
                    <InferredProposals
                      dao={dao.id}
                      config={config}
                      sort={sort}
                      filter={filter}
                    >
                      {children}
                    </InferredProposals>
                  )}
                </DAO.Entity>
              );
            case "Member as proposer":
              return (
                <Member.Entity>
                  {(member: MemberEntity) => (
                    <InferredProposals
                      proposer={member.coreState!.address}
                      config={config}
                      sort={sort}
                      filter={filter}
                    >
                      {children}
                    </InferredProposals>
                  )}
                </Member.Entity>
              );
            case "Plugin":
              return (
                <Plugin.Entity>
                  {(plugin: PluginEntity) => (
                    <InferredProposals
                      plugin={plugin.id}
                      config={config}
                      sort={sort}
                      filter={filter}
                    >
                      {children}
                    </InferredProposals>
                  )}
                </Plugin.Entity>
              );
            default:
              if (from) {
                throw Error(`Unsupported scope: ${from}`);
              }

              return (
                <InferredProposals config={config} sort={sort} filter={filter}>
                  {children}
                </InferredProposals>
              );
          }
        }}
      </Protocol.Config>
    );
  }

  public static get Entities() {
    return InferredProposals.Entities;
  }

  public static get Logs() {
    return InferredProposals.Logs;
  }
}

export default Proposals;

export { Proposals, InferredProposals };
