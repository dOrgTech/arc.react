import * as React from "react";
import { Observable } from "rxjs";
import { IProposalQueryOptions as FilterOptions } from "@daostack/client";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  DAO,
  DAOEntity,
  Member,
  MemberEntity,
  InferredProposal as Component,
  ProposalEntity as Entity,
  ProposalData as Data,
  CProps,
  ComponentList,
  ComponentListLogs,
  ComponentListProps,
  applyScope,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";

type Scopes = "DAO" | "Member as proposer";

const scopeProps: Record<Scopes, string> = {
  DAO: "dao",
  "Member as proposer": "proposer",
};

interface RequiredProps
  extends ComponentListProps<Entity, Data, FilterOptions> {
  scope?: Scopes;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
  dao?: string;
  proposer?: string;
}

class InferredProposals extends ComponentList<InferredProps, Component> {
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
    return (
      <Component
        key={`${entity.id}_${index}`}
        id={entity.id}
        config={this.props.config}
      >
        {children}
      </Component>
    );
  }

  public static get Entities() {
    return CreateContextFeed(
      this._EntitiesContext.Consumer,
      this._LogsContext.Consumer,
      "Proposals"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "Proposals"
    );
  }

  protected static _EntitiesContext = React.createContext<Entity[] | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<
    ComponentListLogs | undefined
  >(undefined);
}

class Proposals extends React.Component<RequiredProps> {
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
                      proposer={member.staticState!.address}
                      config={config}
                      sort={sort}
                      filter={filter}
                    >
                      {children}
                    </InferredProposals>
                  )}
                </Member.Entity>
              );
            default:
              if (scope) {
                throw Error(`Unsupported scope: ${scope}`);
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

export { Proposals };
