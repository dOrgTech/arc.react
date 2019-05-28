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
  ProposalEntity,
} from "./";

interface RequiredProps {
  allDAOs?: boolean;
  filters?: Object | undefined;
  sort?: (proposal: ProposalEntity, sortedList: ProposalEntity[])=> any;
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

  renderComponent(entities: ProposalEntity[], children: any): React.ComponentElement<CProps<DAOProposal>, any> {
    return (
      <DAOProposal id={entities[0].id} dao={entities[0].dao}>
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
    //console.log(dao)
    return dao.proposals(filters);
  }

  renderComponent(entities: ProposalEntity[], children: any): React.ComponentElement<CProps<DAOProposal>, any> {
    const defaultRender = (
      <DAOProposal id={entities[0].id} dao={entities[0].dao}>
      {children}
      </DAOProposal>
    )
    const sort = this.props.sort
    if (sort) {
      let sorted: any = []
      entities.map((entity: ProposalEntity) => {
        sort(entity, sorted)
        //console.log(sorted)
      })
      if (sorted){
        let finalSorted: any = []
        sorted.map((entity: ProposalEntity) => {
          console.log("iterating sorted")
          console.log(entity)
          const temp = (
            <DAOProposal id={entity.id} dao={entity.dao}>
            {children}
            </DAOProposal>
          )
          finalSorted.push(temp)
        })
        return defaultRender
      }
      return defaultRender
    }
    return defaultRender
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
