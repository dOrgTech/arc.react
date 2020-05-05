import * as React from "react";
import { Observable } from "rxjs";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  InferredReward as Component,
  RewardEntity as Entity,
  RewardData as Data,
  DAO,
  DAOEntity,
  Member,
  MemberEntity,
  // Proposal,
  // ProposalEntity,
  Token,
  TokenEntity,
  CProps,
  ComponentList,
  ComponentListLogs,
  ComponentListProps,
  createFilterFromScope,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";
import { IRewardQueryOptions as FilterOptions } from "@dorgtech/arc.js";

type Scopes = "DAO" | "Member as beneficiary" | "Proposal" | "Token";

const scopeProps: Record<Scopes, string> = {
  DAO: "dao",
  "Member as beneficiary": "beneficiary",
  Proposal: "proposal",
  Token: "tokenAddress",
};

interface RequiredProps
  extends ComponentListProps<Entity, Data, FilterOptions> {
  from?: Scopes;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
  dao?: string;
  beneficiary?: string;
  proposal?: string;
  tokenAddress?: string;
}

class InferredRewards extends ComponentList<InferredProps, Component> {
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
      "Rewards"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "Rewards"
    );
  }

  protected static _EntitiesContext = React.createContext<Entity[] | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<
    ComponentListLogs | undefined
  >(undefined);
}

class Rewards extends React.Component<RequiredProps> {
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
                    <InferredRewards
                      dao={dao.id}
                      config={config}
                      sort={sort}
                      filter={filter}
                    >
                      {children}
                    </InferredRewards>
                  )}
                </DAO.Entity>
              );
            case "Member as beneficiary":
              return (
                <Member.Entity>
                  {(beneficiary: MemberEntity) => (
                    <InferredRewards
                      beneficiary={beneficiary.coreState!.address}
                      config={config}
                      sort={sort}
                      filter={filter}
                    >
                      {children}
                    </InferredRewards>
                  )}
                </Member.Entity>
              );
            case "Proposal":
              return (
                <Proposal.Entity>
                  {(proposal: ProposalEntity) => (
                    <InferredRewards
                      proposal={proposal.id}
                      config={config}
                      sort={sort}
                      filter={filter}
                    >
                      {children}
                    </InferredRewards>
                  )}
                </Proposal.Entity>
              );
            case "Token":
              return (
                <Token.Entity>
                  {(token: TokenEntity) => (
                    <InferredRewards
                      tokenAddress={token.id}
                      config={config}
                      sort={sort}
                      filter={filter}
                    >
                      {children}
                    </InferredRewards>
                  )}
                </Token.Entity>
              );
            default:
              if (from) {
                throw Error(`Unsupported scope: ${from}`);
              }

              return (
                <InferredRewards config={config} sort={sort} filter={filter}>
                  {children}
                </InferredRewards>
              );
          }
        }}
      </Protocol.Config>
    );
  }

  public static get Entities() {
    return InferredRewards.Entities;
  }

  public static get Logs() {
    return InferredRewards.Logs;
  }
}

export default Rewards;

export { Rewards, InferredRewards };
