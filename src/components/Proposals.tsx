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
  DAO as InferComponent,
  DAOEntity as InferEntity,
  ArcProposal as Component,
  ProposalEntity as Entity,
  ProposalData as Data
} from "./";
import {
  IProposalQueryOptions as FilterOptions
} from "@daostack/client";

interface RequiredProps extends ComponentListProps<Entity, Data, FilterOptions> {
  allDAOs?: boolean;
}

interface ArcInferredProps {
  arcConfig: ProtocolConfig;
}

interface DAOInferredProps {
  dao: InferEntity;
}

// TODO: SchemeProposals

type ArcProps = RequiredProps & ArcInferredProps;
type DAOProps = RequiredProps & ArcInferredProps & DAOInferredProps;

class ArcProposals extends ComponentList<ArcProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { arcConfig, filter } = this.props;
    return Entity.search(arcConfig.connection, filter);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    return (
      <Component id={entity.id} arcConfig={this.props.arcConfig}>
      {children}
      </Component>
    );
  }
}

class DAOProposals extends ComponentList<DAOProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { dao, filter } = this.props;

    const daoFilter: FilterOptions = filter ? filter : { where: { } };
    if (!daoFilter.where) {
      daoFilter.where = { };
    }
    daoFilter.where.dao = dao.id;

    return Entity.search(dao.context, daoFilter);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    const { arcConfig } = this.props;
    return (
      <Component id={entity.id} arcConfig={arcConfig}>
      {children}
      </Component>
    )
  }
}

class Proposals extends React.Component<RequiredProps>
{
  render() {
    const { children, allDAOs, sort, filter } = this.props;

    if (allDAOs) {
      return (
        <Protocol.Config>
        {(arc: ProtocolConfig) => (
          <ArcProposals arcConfig={arc} sort={sort} filter={filter}>
          {children}
          </ArcProposals>
        )}
        </Protocol.Config>
      );
    } else {
      return (
        <Protocol.Config>
        <InferComponent.Entity>
        {(arc: ProtocolConfig, dao: InferEntity) => (
          <DAOProposals arcConfig={arc} dao={dao} sort={sort} filter={filter}>
          {children}
          </DAOProposals>
        )}
        </InferComponent.Entity>
        </Protocol.Config>
      );
    }
  }
}

export default Proposals;

export {
  ArcProposals,
  DAOProposals,
  Proposals
};
