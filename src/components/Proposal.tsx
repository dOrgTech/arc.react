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

// TODO: get rid of this
import gql from "graphql-tag";
import { first } from "rxjs/operators";

// TODO
type Code = { }

interface RequiredProps extends BaseProps {
  // Proposal ID
  id: string;
}

interface InferredProps {
  // The DAO this proposal is apart of
  dao: DAOEntity | undefined;
}

type Props = RequiredProps & InferredProps;

// TODO: get rid of this and make it apart of the client library
interface StaticState {
  schemeAddress: string;
  votingMachineAddress: string;
}

class DAOProposal extends Component<Props, Entity, Data, Code>
{
  private staticState: StaticState = {
    schemeAddress: "",
    votingMachineAddress: ""
  };

  protected async initialize(): Promise<void> {
    const { dao, id } = this.props;

    if (!dao) {
      throw Error("DAO Missing: Please provide this field as a prop, or use the inference component.");
    }

    // TODO: get rid of this, and instead have this be "fetchStaticState"
    const query = gql`
    {
      proposal (id: "${id}") {
        votingMachine
        scheme {
          address
        }
      }
    }`;

    const itemMap = (item: any): StaticState => {
      return {
        schemeAddress: item.scheme.address,
        votingMachineAddress: item.votingMachine
      };
    };

    this.staticState = await dao.context.getObservableObject(
      query,
      itemMap
    ).pipe(first()).toPromise();
  }

  protected createEntity(): Entity {
    const { dao, id } = this.props;

    if (!dao) {
      throw Error("DAO Missing: Please provide this field as a prop, or use the inference component.");
    }

    return new Entity(
      id,
      dao.address,
      this.staticState.schemeAddress,
      this.staticState.votingMachineAddress,
      dao.context
    );
  }

  public static get Entity() {
    return CreateContextFeed(this._EntityContext.Consumer, this._LogsContext.Consumer);
  }

  public static get Data() {
    return CreateContextFeed(this._DataContext.Consumer, this._LogsContext.Consumer);
  }

  public static get Code() {
    return CreateContextFeed(this._CodeContext.Consumer, this._LogsContext.Consumer);
  }

  public static get Logs() {
    return CreateContextFeed(this._LogsContext.Consumer, this._LogsContext.Consumer);
  }

  protected static _EntityContext = React.createContext({ });
  protected static _DataContext   = React.createContext({ });
  protected static _CodeContext   = React.createContext({ });
  protected static _LogsContext   = React.createContext({ });
}

class Proposal extends React.Component<RequiredProps>
{
  public render() {
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
