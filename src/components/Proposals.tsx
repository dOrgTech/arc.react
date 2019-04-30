import * as React from "react";
import { Observable } from "rxjs";
import {
  CEntity,
  CProps,
  ComponentList,
  BaseProps
} from "../runtime";
import {
  DAO,
  DAOEntity,
  DAOProposal
} from "./";

interface RequiredProps { }

interface InferredProps {
  dao: DAOEntity | undefined;
}

type Props = RequiredProps & InferredProps & BaseProps;

class DAOProposals extends ComponentList<Props, DAOProposal>
{
  createObservableEntities(): Observable<CEntity<DAOProposal>[]> {
    const { dao } = this.props;
    if (!dao) {
      throw Error("DAO Entity Missing: Please provide this field as a prop, or use the inference component.");
    }
    return dao.proposals();
  }

  renderComponent(entity: CEntity<DAOProposal>, children: any): React.ComponentElement<CProps<DAOProposal>, any> {
    const { dao } = this.props;
    return (
      <DAOProposal id={entity.id} dao={dao}>
        {children}
      </DAOProposal>
    );
  }
}

class Proposals extends React.Component<RequiredProps>
{
  render() {
    const { children } = this.props;
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

export default Proposals;

export {
  DAOProposals,
  Proposals
};
