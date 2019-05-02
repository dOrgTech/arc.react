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

const entityConsumer = Component.EntityContext<Entity>().Consumer;
const dataConsumer   = Component.DataContext<Data>().Consumer;
const codeConsumer   = Component.CodeContext<Code>().Consumer;
const logsConsumer   = Component.LogsContext().Consumer;

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
    return CreateContextFeed(entityConsumer);
  }

  public static get Data() {
    return CreateContextFeed(dataConsumer);
  }

  public static get Code() {
    return CreateContextFeed(codeConsumer);
  }

  public static get Logs() {
    return CreateContextFeed(logsConsumer);
  }
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
    return CreateContextFeed(entityConsumer);
  }

  public static get Data() {
    return CreateContextFeed(dataConsumer);
  }

  public static get Code() {
    return CreateContextFeed(codeConsumer);
  }

  public static get Logs() {
    return CreateContextFeed(logsConsumer);
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
