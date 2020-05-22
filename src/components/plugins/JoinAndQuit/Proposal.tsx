import * as React from "react";
import {
  JoinAndQuitProposal as Entity,
  IJoinAndQuitProposalState as Data,
} from "@daostack/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  Component,
  ComponentLogs,
  ComponentProps,
  Proposal,
} from "../../../";
import { CreateContextFeed } from "../../../runtime/ContextFeed";

interface RequiredProps extends ComponentProps<Entity, Data> {
  // Proposal ID
  id?: string | Entity;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
  id: string | Entity;
}

class InferredJoinAndQuitProposal extends Component<
  InferredProps,
  Entity,
  Data
> {
  protected createEntity(): Entity {
    const { config, id } = this.props;
    if (!config) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }

    const proposalId = typeof id === "string" ? id : id.id;
    return new Entity(config.connection, proposalId);
  }

  public static get Entity() {
    return CreateContextFeed(
      this.EntityContext.Consumer,
      this.LogsContext.Consumer,
      "JoinAndQuitProposal"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this.DataContext.Consumer,
      this.LogsContext.Consumer,
      "JoinAndQuitProposal"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this.LogsContext.Consumer,
      this.LogsContext.Consumer,
      "JoinAndQuitProposal"
    );
  }

  public static EntityContext = React.createContext<Entity | undefined>(
    undefined
  );
  public static DataContext = React.createContext<Data | undefined>(undefined);
  public static LogsContext = React.createContext<ComponentLogs | undefined>(
    undefined
  );
}

function useJoinAndQuitProposal(): [Data | undefined, Entity | undefined] {
  const data = React.useContext<Data | undefined>(
    InferredJoinAndQuitProposal.DataContext
  );
  const entity = React.useContext<Entity | undefined>(
    InferredJoinAndQuitProposal.EntityContext
  );

  return [data, entity];
}

class JoinAndQuitProposal extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;

    const renderInferred = (id: string | Entity) => (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredJoinAndQuitProposal id={id} config={config}>
            {children}
          </InferredJoinAndQuitProposal>
        )}
      </Protocol.Config>
    );

    if (!id) {
      return (
        <Proposal.Entity>
          {(proposal: Entity) => renderInferred(proposal.id)}
        </Proposal.Entity>
      );
    } else {
      return renderInferred(id);
    }
  }

  public static get Entity() {
    return InferredJoinAndQuitProposal.Entity;
  }

  public static get Data() {
    return InferredJoinAndQuitProposal.Data;
  }

  public static get Logs() {
    return InferredJoinAndQuitProposal.Logs;
  }
}

export default JoinAndQuitProposal;

export {
  InferredJoinAndQuitProposal,
  JoinAndQuitProposal,
  Entity as JoinAndQuitProposalEntity,
  Data as JoinAndQuitProposalData,
  useJoinAndQuitProposal,
};
