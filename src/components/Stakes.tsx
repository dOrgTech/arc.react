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
  InferredStake as Component,
  StakeEntity as Entity,
  StakeData as Data
} from "./";
import {
  IStakeQueryOptions as FilterOptions
} from "@daostack/client";

interface RequiredProps extends ComponentListProps<Entity, Data, FilterOptions> {
  scope?: "DAO" | "Member as staker" | "Proposal";
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

interface DAOScopeProps extends InferredProps {
  dao: string;
}

interface StakerScopeProps extends InferredProps {
  staker: string;
}

interface ProposalScopeProps extends InferredProps {
  proposal: string;
}

class InferredStakes extends ComponentList<InferredProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { config, filter } = this.props;
    return Entity.search(config.connection, filter);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    const { config } = this.props;

    if (!entity.id) {
      throw Error("Stake Entity ID undefined. This should never happen.");
    }

    return (
      <Component id={entity.id} config={config}>
      {children}
      </Component>
    );
  }
}

class DAOScopeStakes extends ComponentList<DAOScopeProps, Component>
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

    if (!entity.id) {
      throw Error("Stake Entity ID undefined. This should never happen.");
    }

    return (
      <Component id={entity.id} config={config}>
      {children}
      </Component>
    )
  }
}

class StakerScopeStakes extends ComponentList<StakerScopeProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { staker, config, filter } = this.props;

    const stakerFilter: FilterOptions = filter ? filter : { where: { } };
    if (!stakerFilter.where) {
      stakerFilter.where = { };
    }
    stakerFilter.where.staker = staker;

    return Entity.search(config.connection, stakerFilter);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    const { config } = this.props;

    if (!entity.id) {
      throw Error("Stake Entity ID undefined. This should never happen.");
    }

    return (
      <Component id={entity.id} config={config}>
      {children}
      </Component>
    )
  }
}

class ProposalScopeStakes extends ComponentList<ProposalScopeProps, Component>
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

    if (!entity.id) {
      throw Error("Stake Entity ID undefined. This should never happen.");
    }

    return (
      <Component id={entity.id} config={config}>
      {children}
      </Component>
    )
  }
}

class Stakes extends React.Component<RequiredProps>
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
              {(dao: DAOEntity) =>(
                <DAOScopeStakes dao={dao.id} config={config} sort={sort} filter={filter}>
                {children}
                </DAOScopeStakes>
              )}
              </DAO.Entity>
            );
          case "Member as staker":
            return (
              <Member.Entity>
              {(staker: MemberEntity) =>{
                if (!staker.id) {
                  throw Error("Member Entity ID undefined. This should never happen.");
                }
                return (
                  <StakerScopeStakes staker={staker.id} config={config} sort={sort} filter={filter}>
                  {children}
                  </StakerScopeStakes>
                );
              }}
              </Member.Entity>
            );
          case "Proposal":
            return (
              <Proposal.Entity>
              {(proposal: ProposalEntity) =>(
                <ProposalScopeStakes proposal={proposal.id} config={config} sort={sort} filter={filter}>
                {children}
                </ProposalScopeStakes>
              )}
              </Proposal.Entity>
            );
          default:
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
}

export default Stakes;

export {
  Stakes
};
