import * as React from "react";
import { Observable } from "rxjs";
import {
  CProps,
  ComponentList,
  ComponentListProps
} from "../runtime";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig
} from "../protocol";
import {
  DAO,
  DAOEntity,
  Member,
  MemberEntity,
  Proposal,
  ProposalEntity,
  Token,
  TokenEntity,
  InferredReward as Component,
  RewardEntity as Entity,
  RewardData as Data
} from "./";
import {
  IRewardQueryOptions as FilterOptions
} from "@daostack/client";

interface RequiredProps extends ComponentListProps<Entity, Data, FilterOptions> {
  scope?: "DAO" | "Member as beneficiary" | "Proposal" | "Token";
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

interface DAOScopeProps extends InferredProps {
  dao: string;
}

interface BeneficiaryScopeProps extends InferredProps {
  beneficiary: string;
}

interface ProposalScopeProps extends InferredProps {
  proposal: string;
}

interface TokenScopeProps extends InferredProps {
  token: string;
}

class InferredRewards extends ComponentList<InferredProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { config, filter } = this.props;
    return Entity.search(config.connection, filter);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    const { config } = this.props;

    return (
      <Component id={entity.id} config={config}>
      {children}
      </Component>
    );
  }
}

class DAOScopeRewards extends ComponentList<DAOScopeProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { dao, config, filter } = this.props;

    const daoFilter: FilterOptions = filter ? filter : { where: { } };
    if (!daoFilter.where) {
      daoFilter.where = { };
    }
    daoFilter.where.dao = dao;

    return Entity.search(config.connection, daoFilter);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    const { config } = this.props;
    return (
      <Component id={entity.id} config={config}>
      {children}
      </Component>
    )
  }
}

class BeneficiaryScopeRewards extends ComponentList<BeneficiaryScopeProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { beneficiary, config, filter } = this.props;

    const beneficiaryFilter: FilterOptions = filter ? filter : { where: { } };
    if (!beneficiaryFilter.where) {
      beneficiaryFilter.where = { };
    }
    beneficiaryFilter.where.beneficiary = beneficiary;

    return Entity.search(config.connection, beneficiaryFilter);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    const { config } = this.props;
    return (
      <Component id={entity.id} config={config}>
      {children}
      </Component>
    )
  }
}

class ProposalScopeRewards extends ComponentList<ProposalScopeProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { proposal, config, filter } = this.props;

    const proposalFilter: FilterOptions = filter ? filter : { where: { } };
    if (!proposalFilter.where) {
      proposalFilter.where = { };
    }
    proposalFilter.where.proposal = proposal;

    return Entity.search(config.connection, proposalFilter);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    const { config } = this.props;
    return (
      <Component id={entity.id} config={config}>
      {children}
      </Component>
    )
  }
}

class TokenScopeRewards extends ComponentList<TokenScopeProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { token, config, filter } = this.props;

    const tokenFilter: FilterOptions = filter ? filter : { where: { } };
    if (!tokenFilter.where) {
      tokenFilter.where = { };
    }
    tokenFilter.where.tokenAddress = token;

    return Entity.search(config.connection, tokenFilter);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    const { config } = this.props;
    return (
      <Component id={entity.id} config={config}>
      {children}
      </Component>
    )
  }
}

class Rewards extends React.Component<RequiredProps>
{
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
                <DAOScopeRewards dao={dao.id} config={config} sort={sort} filter={filter}>
                {children}
                </DAOScopeRewards>
              )}
              </DAO.Entity>
            );
          case "Member as beneficiary":
            return (
              <Member.Entity>
              {(beneficiary: MemberEntity) => (
                <BeneficiaryScopeRewards beneficiary={beneficiary.staticState!.address} config={config} sort={sort} filter={filter}>
                {children}
                </BeneficiaryScopeRewards>
              )}
              </Member.Entity>
            );
          case "Proposal":
            return (
              <Proposal.Entity>
              {(proposal: ProposalEntity) => (
                <ProposalScopeRewards proposal={proposal.id} config={config} sort={sort} filter={filter}>
                {children}
                </ProposalScopeRewards>
              )}
              </Proposal.Entity>
            );
          case "Token":
            return (
              <Token.Entity>
              {(token: TokenEntity) => (
                <TokenScopeRewards token={token.id} config={config} sort={sort} filter={filter}>
                {children}
                </TokenScopeRewards>
              )}
              </Token.Entity>
            );
          default:
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
}

export default Rewards;

export {
  Rewards
};
