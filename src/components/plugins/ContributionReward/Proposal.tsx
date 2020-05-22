import * as React from "react";
import {
  ContributionRewardProposal as Entity,
  IContributionRewardProposalState as Data,
} from "@dorgtech/arc.js";
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

class InferredContributionRewardProposal extends Component<
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
      "ContributionRewardProposal"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this.DataContext.Consumer,
      this.LogsContext.Consumer,
      "ContributionRewardProposal"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this.LogsContext.Consumer,
      this.LogsContext.Consumer,
      "ContributionRewardProposal"
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

function useContributionRewardProposal(): [
  Data | undefined,
  Entity | undefined
] {
  const data = React.useContext<Data | undefined>(
    InferredContributionRewardProposal.DataContext
  );
  const entity = React.useContext<Entity | undefined>(
    InferredContributionRewardProposal.EntityContext
  );

  return [data, entity];
}

class ContributionRewardProposal extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;

    const renderInferred = (id: string | Entity) => (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredContributionRewardProposal id={id} config={config}>
            {children}
          </InferredContributionRewardProposal>
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
    return InferredContributionRewardProposal.Entity;
  }

  public static get Data() {
    return InferredContributionRewardProposal.Data;
  }

  public static get Logs() {
    return InferredContributionRewardProposal.Logs;
  }
}

export default ContributionRewardProposal;

export {
  InferredContributionRewardProposal,
  ContributionRewardProposal,
  Data as ContributionRewardProposalData,
  Entity as ContributionRewardProposalEntity,
  useContributionRewardProposal,
};
