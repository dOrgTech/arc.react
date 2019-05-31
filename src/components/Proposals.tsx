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

interface RequiredProps extends ComponentListProps<Entity, Data> {
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
    const { arcConfig } = this.props;
    if (!arcConfig) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }
    return Entity.search(arcConfig.connection);
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
    const { dao } = this.props;
    if (!dao) {
      throw Error("DAO Missing: Please provide this field as a prop, or use the inference component.");
    }
    return Entity.search(dao.context, { dao: dao.address });
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
    const { children, allDAOs, sort } = this.props;

    if (allDAOs) {
      return (
        <Protocol.Config>
        {(arc: ProtocolConfig) => (
          <ArcProposals arcConfig={arc} sort={sort}>
          {children}
          </ArcProposals>
        )}
        </Protocol.Config>
      );
    } else {
      return (
        <InferComponent.Entity>
        {(dao: InferEntity) => (
          <DAOProposals dao={dao} sort={sort}>
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
