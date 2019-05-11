import * as React from "react";
import {
  Component,
  ComponentLogs,
  BaseProps
} from "../runtime";
import {
  CreateContextFeed
} from "../runtime/ContextFeed";
import {
  DAO,
  DAOEntity
} from "./";
import {
  Proposal as Entity,
  IProposalState as Data
} from "@daostack/client";

// TODO
type Code = { }

interface RequiredProps {
  // Proposal ID
  id: string;
}

interface InferredProps {
  // The DAO this proposal is apart of
  dao: DAOEntity | undefined;
}

type Props = RequiredProps & InferredProps & BaseProps;

class DAOProposal extends Component<Props, Entity, Data, Code>
{
  createEntity(): Entity {
    const { dao, id } = this.props;

    if (!dao) {
      throw Error("DAO Missing: Please provide this field as a prop, or use the inference component.");
    }

    return dao.proposal(id);
  }

  public static get Entity() {
    return CreateContextFeed(this._EntityContext.Consumer);
  }

  public static get Data() {
    return CreateContextFeed(this._DataContext.Consumer);
  }

  public static get Code() {
    return CreateContextFeed(this._CodeContext.Consumer);
  }

  public static get Logs() {
    return CreateContextFeed(this._LogsContext.Consumer);
  }

  protected static _EntityContext = React.createContext({ });
  protected static _DataContext   = React.createContext({ });
  protected static _CodeContext   = React.createContext({ });
  protected static _LogsContext   = React.createContext({ });
}

class Proposal extends React.Component<RequiredProps>
{
  render() {
    const { id, children } = this.props;

    return (
      <DAO.Entity>
      {(entity: DAOEntity) => (
        <DAOProposal id={id} dao={entity}>
        {children}
        </DAOProposal>
      )}
      </DAO.Entity>
    );
  }

  public static get Entity() {
    return DAOProposal.Entity;
  }

  public static get Data() {
    return DAOProposal.Data;
  }

  public static get Code() {
    return DAOProposal.Code;
  }

  public static get Logs() {
    return DAOProposal.Logs;
  }
}

export default Proposal;

export {
  DAOProposal,
  Proposal,
  Props  as ProposalProps,
  Entity as ProposalEntity,
  Data   as ProposalData,
  Code   as ProposalCode,
  ComponentLogs
};
