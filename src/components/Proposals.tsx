import * as React from "react";
import { Observable } from "rxjs";
import {
  CProps,
  ComponentList,
  BaseProps
} from "../runtime";
import {
  Arc,
  ArcConfig
} from "../protocol";
import {
  DAO,
  DAOEntity,
  DAOProposal,
  ProposalEntity
} from "./";

interface RequiredProps extends BaseProps {
  allDAOs?: boolean;
}

interface ArcInferredProps {
  // Arc Instance
  arcConfig: ArcConfig | undefined;
}

interface DAOInferredProps {
  // DAO Instance
  dao: DAOEntity | undefined;
}

type ArcProps = RequiredProps & ArcInferredProps;
type DAOProps = RequiredProps & DAOInferredProps;

class ArcProposals extends ComponentList<ArcProps, DAOProposal>
{
  createObservableEntities(): Observable<ProposalEntity[]> {
    const { arcConfig } = this.props;
    if (!arcConfig) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }
    return ProposalEntity.search({}, arcConfig.connection);
  }

  renderComponent(entity: ProposalEntity, children: any): React.ComponentElement<CProps<DAOProposal>, any> {
    return (
      <DAOProposal id={entity.id} dao={entity.dao}>
      {children}
      </DAOProposal>
    );
  }
}

class DAOProposals extends ComponentList<DAOProps, DAOProposal>
{
  createObservableEntities(): Observable<ProposalEntity[]> {
    const { dao } = this.props;
    if (!dao) {
      throw Error("DAO Missing: Please provide this field as a prop, or use the inference component.");
    }
    return dao.proposals({});
  }

  renderComponent(entity: ProposalEntity, children: any): React.ComponentElement<CProps<DAOProposal>, any> {
    return (
      <DAOProposal id={entity.id} dao={entity.dao}>
      {children}
      </DAOProposal>
    )
  }
}

class Proposals extends React.Component<RequiredProps>
{
  render() {
    const { children, allDAOs } = this.props;

    if (allDAOs) {
      return (
        <Arc.Config>
        {(arc: ArcConfig) => (
          <ArcProposals arcConfig={arc}>
          {children}
          </ArcProposals>
        )}
        </Arc.Config>
      );
    } else {
      return (
        <DAO.Entity>
        {(dao: DAOEntity) => (
          <DAOProposals dao={dao}>
          {children}
          </DAOProposals>
        )}
        </DAO.Entity>
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
