import * as React from "react";
import {
  ContributionRewardExtProposal as Entity,
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

class InferredContributionRewardExtProposal extends Component<
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
      "ContributionRewardExtProposal"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this.DataContext.Consumer,
      this.LogsContext.Consumer,
      "ContributionRewardExtProposal"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this.LogsContext.Consumer,
      this.LogsContext.Consumer,
      "ContributionRewardExtProposal"
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

function useContributionRewardExtProposal(): [
  Data | undefined,
  Entity | undefined
] {
  const data = React.useContext<Data | undefined>(
    InferredContributionRewardExtProposal.DataContext
  );
  const entity = React.useContext<Entity | undefined>(
    InferredContributionRewardExtProposal.EntityContext
  );

  return [data, entity];
}

class ContributionRewardExtProposal extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;

    const renderInferred = (id: string | Entity) => (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredContributionRewardExtProposal id={id} config={config}>
            {children}
          </InferredContributionRewardExtProposal>
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
    return InferredContributionRewardExtProposal.Entity;
  }

  public static get Data() {
    return InferredContributionRewardExtProposal.Data;
  }

  public static get Logs() {
    return InferredContributionRewardExtProposal.Logs;
  }
}

export default ContributionRewardExtProposal;

export {
  InferredContributionRewardExtProposal,
  ContributionRewardExtProposal,
  Entity as ContributionRewardExtProposalEntity,
  Data as ContributionRewardExtProposalData,
  useContributionRewardExtProposal,
};
