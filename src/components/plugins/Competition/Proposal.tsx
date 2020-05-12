import * as React from "react";
import { CompetitionProposal as Entity } from "@dorgtech/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  Component,
  ComponentLogs,
  ComponentProps,
  ProposalEntity,
  ProposalData,
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

class InferredCompetitionProposal extends Component<
  InferredProps,
  ProposalEntity,
  ProposalData
> {
  protected createEntity(): ProposalEntity {
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
      this._EntityContext.Consumer,
      this._LogsContext.Consumer,
      "CompetitionProposal"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this._DataContext.Consumer,
      this._LogsContext.Consumer,
      "CompetitionProposal"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "CompetitionProposal"
    );
  }

  protected static _EntityContext = React.createContext<Entity | undefined>(
    undefined
  );
  protected static _DataContext = React.createContext<ProposalData | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<
    ComponentLogs | undefined
  >(undefined);
}

class CompetitionProposal extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;

    const renderInferred = (id: string | Entity) => (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredCompetitionProposal id={id} config={config}>
            {children}
          </InferredCompetitionProposal>
        )}
      </Protocol.Config>
    );

    if (!id) {
      return (
        <Proposal.Entity>
          {(proposal: ProposalEntity) => renderInferred(proposal.id)}
        </Proposal.Entity>
      );
    } else {
      return renderInferred(id);
    }
  }

  public static get Entity() {
    return InferredCompetitionProposal.Entity;
  }

  public static get Data() {
    return InferredCompetitionProposal.Data;
  }

  public static get Logs() {
    return InferredCompetitionProposal.Logs;
  }
}

export default CompetitionProposal;

export {
  InferredCompetitionProposal,
  CompetitionProposal,
  Entity as CompetitionProposalEntity,
};
