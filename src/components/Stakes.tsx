import * as React from "react";
import { Observable } from "rxjs";
import { IStakeQueryOptions as FilterOptions } from "@dorgtech/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  InferredStake as Component,
  StakeEntity as Entity,
  StakeData as Data,
  DAO,
  DAOEntity,
  Member,
  MemberEntity,
  Proposal,
  ProposalEntity,
  CProps,
  ComponentList,
  ComponentListLogs,
  ComponentListProps,
  createFilterFromScope,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";

type Scopes = "DAO" | "Member as staker" | "Proposal";

const scopeProps: Record<Scopes, string> = {
  DAO: "dao",
  "Member as staker": "staker",
  Proposal: "proposal",
};

interface RequiredProps extends ComponentListProps<Entity, FilterOptions> {
  from?: Scopes;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
  dao?: string;
  staker?: string;
  proposal?: string;
}

class InferredStakes extends ComponentList<InferredProps, Component> {
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

    // TODO: remove this after we update to 2.0
    if (!entity.id) {
      throw Error("Stake Entity ID undefined. This should never happen.");
    }

    return (
      <Component
        key={`${entity.id}_${index}`}
        id={entity.id}
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
      "Stakes"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "Stakes"
    );
  }

  protected static _EntitiesContext = React.createContext<Entity[] | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<
    ComponentListLogs | undefined
  >(undefined);
}

class Stakes extends React.Component<RequiredProps> {
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
                    <InferredStakes
                      dao={dao.id}
                      config={config}
                      sort={sort}
                      filter={filter}
                    >
                      {children}
                    </InferredStakes>
                  )}
                </DAO.Entity>
              );
            case "Member as staker":
              return (
                <Member.Entity>
                  {(staker: MemberEntity) => {
                    return (
                      <InferredStakes
                        staker={staker.id}
                        config={config}
                        sort={sort}
                        filter={filter}
                      >
                        {children}
                      </InferredStakes>
                    );
                  }}
                </Member.Entity>
              );
            case "Proposal":
              return (
                <Proposal.Entity>
                  {(proposal: ProposalEntity) => (
                    <InferredStakes
                      proposal={proposal.id}
                      config={config}
                      sort={sort}
                      filter={filter}
                    >
                      {children}
                    </InferredStakes>
                  )}
                </Proposal.Entity>
              );
            default:
              if (from) {
                throw Error(`Unsupported scope: ${from}`);
              }

              return (
                <InferredStakes config={config} sort={sort} filter={filter}>
                  {children}
                </InferredStakes>
              );
          }
        }}
      </Protocol.Config>
    );
  }

  public static get Entities() {
    return InferredStakes.Entities;
  }

  public static get Logs() {
    return InferredStakes.Logs;
  }
}

export default Stakes;

export { Stakes, InferredStakes };
