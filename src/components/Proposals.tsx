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
  InferredProposal as Component,
  ProposalEntity as Entity,
  ProposalData as Data
} from "./";
import {
  IProposalQueryOptions as FilterOptions
} from "@daostack/client";

interface RequiredProps extends ComponentListProps<Entity, Data, FilterOptions> {
  scope?: "DAO" | "Member as proposer";
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

interface DAOScopeProps extends InferredProps {
  dao: string;
}

interface ProposerScopeProps extends InferredProps {
  proposer: string;
}

// TODO: SchemeProposals

class InferredProposals extends ComponentList<InferredProps, Component>
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

class DAOScopeProposals extends ComponentList<DAOScopeProps, Component>
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

class ProposerScopeProposals extends ComponentList<ProposerScopeProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { proposer, config, filter } = this.props;

    const proposerFilter: FilterOptions = filter ? filter : { where: { } };
    if (!proposerFilter.where) {
      proposerFilter.where = { };
    }
    proposerFilter.where.proposer = proposer;

    return Entity.search(config.connection, proposerFilter);
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

class Proposals extends React.Component<RequiredProps>
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
                <DAOScopeProposals dao={dao.id} config={config} sort={sort} filter={filter}>
                {children}
                </DAOScopeProposals>
              )}
              </DAO.Entity>
            );
          case "Member as proposer":
            return (
              <Member.Entity>
              {(member: MemberEntity) => (
                <ProposerScopeProposals proposer={member.staticState!.address} config={config} sort={sort} filter={filter}>
                {children}
                </ProposerScopeProposals>
              )}
              </Member.Entity>
            );
          default:
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
}

export default Proposals;

export {
  Proposals
};
