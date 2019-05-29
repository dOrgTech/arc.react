import * as React from "react";
import { Observable } from "rxjs";
import {
  CEntity,
  CProps,
  ComponentList,
} from "../runtime";
import {
  Arc,
  ArcConfig
} from "../protocol";
import {
  DAO,
  DAOEntity,
  DAOProposal,
  ProposalData,
  ProposalEntity,
} from "./";

const { first } = require('rxjs/operators')

interface RequiredProps {
  allDAOs?: boolean;
  filters?: Object | undefined;
  sort?: (unsortedList: any)=> any;
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
    const { arcConfig, filters } = this.props;
    if (!arcConfig || !filters) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }
    return ProposalEntity.search(filters, arcConfig.connection);
  }

  fetchData(entity: ProposalEntity): Promise<any> {
    return new Promise((resolve, reject) => {
      const state = entity.state()
      state.subscribe(
        (data: ProposalData) => resolve(data),
        (error: Error) => reject(error))
    })
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
  createObservableEntities(): Observable<CEntity<DAOProposal>[]> {
    const { dao, filters } = this.props;
    if (!dao) {
      throw Error("DAO Missing: Please provide this field as a prop, or use the inference component.");
    }
    return dao.proposals(filters);
  }

  async fetchData(entity: ProposalEntity): Promise<any>{
    return entity.state().pipe(first()).toPromise();
  }

  renderComponent(entity: ProposalEntity, children: any): React.ComponentElement<CProps<DAOProposal>, any> {
    //const sort = this.props.sort
    //if (sort) console.log(typeof(sort))
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
    const { children, allDAOs, filters, sort } = this.props;

    if (allDAOs) {
      return (
        <Arc.Config>
        {(arc: ArcConfig) => (
          <ArcProposals arcConfig={arc} filters={filters} sort={sort}>
          {children}
          </ArcProposals>
        )}
        </Arc.Config>
      );
    } else {
      return (
        <DAO.Entity>
        {(dao: DAOEntity) => (
          <DAOProposals dao={dao} filters={filters} sort={sort}>
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
