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
  DAOProposal as Component,
  ProposalEntity as Entity,
  ProposalData as Data
} from "./";
// TODO: change the import path once the PR is merged
import {
  IProposalQueryOptions as FilterOptions
} from "@daostack/client/src/proposal";

interface RequiredProps extends ComponentListProps<Entity, Data, FilterOptions> {
  allDAOs?: boolean;
}

interface ArcInferredProps {
  arcConfig: ProtocolConfig | undefined;
}

interface DAOInferredProps {
  dao: InferEntity | undefined;
}

type ArcProps = RequiredProps & ArcInferredProps;
type DAOProps = RequiredProps & DAOInferredProps;

class ArcProposals extends ComponentList<ArcProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { arcConfig, filter } = this.props;
    if (!arcConfig) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }
    return Entity.search(arcConfig.connection, filter);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    return (
      <Component id={entity.id} dao={entity.dao}>
      {children}
      </Component>
    );
  }
}

class DAOProposals extends ComponentList<DAOProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { dao, filter } = this.props;
    if (!dao) {
      throw Error("DAO Missing: Please provide this field as a prop, or use the inference component.");
    }
    const daoFilter: FilterOptions = filter ? filter : { };
    daoFilter.dao = dao.address;
    return Entity.search(dao.context, daoFilter);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    return (
      <Component id={entity.id} dao={entity.dao}>
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
        <InferComponent.Entity>
        {(dao: InferEntity) => (
          <DAOProposals dao={dao} sort={sort} filter={filter}>
          {children}
          </DAOProposals>
        )}
        </InferComponent.Entity>
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
