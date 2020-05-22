import * as React from "react";
import {
  PluginRegistrarProposal as Entity,
  IPluginRegistrarProposalState as Data,
} from "@daostack/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  Component,
  ComponentLogs,
  ComponentProps,
  Proposal,
} from "../../..";
import { CreateContextFeed } from "../../../runtime/ContextFeed";

interface RequiredProps extends ComponentProps<Entity, Data> {
  // Proposal ID
  id?: string | Entity;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
  id: string | Entity;
}

class InferredPluginRegistrarProposal extends Component<
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
      "PluginRegistrarProposal"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this.DataContext.Consumer,
      this.LogsContext.Consumer,
      "PluginRegistrarProposal"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this.LogsContext.Consumer,
      this.LogsContext.Consumer,
      "PluginRegistrarProposal"
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

function usePluginRegistrarProposal(): [Data | undefined, Entity | undefined] {
  const data = React.useContext<Data | undefined>(
    InferredPluginRegistrarProposal.DataContext
  );
  const entity = React.useContext<Entity | undefined>(
    InferredPluginRegistrarProposal.EntityContext
  );

  return [data, entity];
}

class PluginRegistrarProposal extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;

    const renderInferred = (id: string | Entity) => (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredPluginRegistrarProposal id={id} config={config}>
            {children}
          </InferredPluginRegistrarProposal>
        )}
      </Protocol.Config>
    );

    if (!id) {
      return (
        <Proposal.Entity>
          {(proposal: Data) => renderInferred(proposal.id)}
        </Proposal.Entity>
      );
    } else {
      return renderInferred(id);
    }
  }

  public static get Entity() {
    return InferredPluginRegistrarProposal.Entity;
  }

  public static get Data() {
    return InferredPluginRegistrarProposal.Data;
  }

  public static get Logs() {
    return InferredPluginRegistrarProposal.Logs;
  }
}

export default PluginRegistrarProposal;

export {
  InferredPluginRegistrarProposal,
  PluginRegistrarProposal,
  Entity as PluginRegistrarProposalEntity,
  Data as PluginRegistrarProposalData,
  usePluginRegistrarProposal,
};
