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
  InferredVote as Component,
  VoteEntity as Entity,
  VoteData as Data
} from "./";
import {
  IVoteQueryOptions as FilterOptions
} from "@daostack/client";

interface RequiredProps extends ComponentListProps<Entity, Data, FilterOptions> {
  scope?: "DAO" | "Member as voter" | "Proposal";
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

interface DAOScopeProps extends InferredProps {
  dao: string;
}

interface VoterScopeProps extends InferredProps {
  voter: string;
}

interface ProposalScopeProps extends InferredProps {
  proposal: string;
}

class InferredVotes extends ComponentList<InferredProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { config, filter } = this.props;
    return Entity.search(config.connection, filter);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    const { config } = this.props;

    if (!entity.id) {
      throw Error("Vote Entity ID undefined. This should never happen.");
    }

    return (
      <Component id={entity.id} config={config}>
      {children}
      </Component>
    );
  }
}

class DAOScopeVotes extends ComponentList<DAOScopeProps, Component>
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
      throw Error("Vote Entity ID undefined. This should never happen.");
    }

    return (
      <Component id={entity.id} config={config}>
      {children}
      </Component>
    )
  }
}

class VoterScopeVotes extends ComponentList<VoterScopeProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { voter, config, filter } = this.props;

    const voterFilter: FilterOptions = filter ? filter : { where: { } };
    if (!voterFilter.where) {
      voterFilter.where = { };
    }
    voterFilter.where.voter = voter;

    return Entity.search(config.connection, voterFilter);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    const { config } = this.props;

    if (!entity.id) {
      throw Error("Vote Entity ID undefined. This should never happen.");
    }

    return (
      <Component id={entity.id} config={config}>
      {children}
      </Component>
    )
  }
}

class ProposalScopeVotes extends ComponentList<ProposalScopeProps, Component>
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
      throw Error("Vote Entity ID undefined. This should never happen.");
    }

    return (
      <Component id={entity.id} config={config}>
      {children}
      </Component>
    )
  }
}

class Votes extends React.Component<RequiredProps>
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
                <DAOScopeVotes dao={dao.id} config={config} sort={sort} filter={filter}>
                {children}
                </DAOScopeVotes>
              )}
              </DAO.Entity>
            );
          case "Member as voter":
            return (
              <Member.Entity>
              {(voter: MemberEntity) => {
                console.log("here")
                if (!voter.id) {
                  throw Error("Member Entity ID undefined. This should never happen.");
                }
                return (
                  <VoterScopeVotes voter={voter.id} config={config} sort={sort} filter={filter}>
                  {children}
                  </VoterScopeVotes>
                );
              }}
              </Member.Entity>
            );
          case "Proposal":
            return (
              <Proposal.Entity>
              {(proposal: ProposalEntity) =>(
                <ProposalScopeVotes proposal={proposal.id} config={config} sort={sort} filter={filter}>
                {children}
                </ProposalScopeVotes>
              )}
              </Proposal.Entity>
            );
          default:
            return (
              <InferredVotes config={config} sort={sort} filter={filter}>
              {children}
              </InferredVotes>
            );
        }
      }}
      </Protocol.Config>
    );
  }
}

export default Votes;

export {
  Votes
};
