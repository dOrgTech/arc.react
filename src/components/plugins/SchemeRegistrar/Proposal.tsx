import * as React from "react";
import {
  SchemeRegistrarProposal as Entity,
  ISchemeRegistrarProposalState as Data,
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

interface RequiredProps extends ComponentProps {
  // Proposal ID
  id?: string | Entity;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
  id: string | Entity;
}

class InferredSchemeRegistrarProposal extends Component<
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
      "SchemeRegistrarProposal"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this.DataContext.Consumer,
      this.LogsContext.Consumer,
      "SchemeRegistrarProposal"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this.LogsContext.Consumer,
      this.LogsContext.Consumer,
      "SchemeRegistrarProposal"
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

function useSchemeRegistrarProposal(): [Data | undefined, Entity | undefined] {
  const data = React.useContext<Data | undefined>(
    InferredSchemeRegistrarProposal.DataContext
  );
  const entity = React.useContext<Entity | undefined>(
    InferredSchemeRegistrarProposal.EntityContext
  );

  return [data, entity];
}

class SchemeRegistrarProposal extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;

    const renderInferred = (id: string | Entity) => (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredSchemeRegistrarProposal id={id} config={config}>
            {children}
          </InferredSchemeRegistrarProposal>
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
    return InferredSchemeRegistrarProposal.Entity;
  }

  public static get Data() {
    return InferredSchemeRegistrarProposal.Data;
  }

  public static get Logs() {
    return InferredSchemeRegistrarProposal.Logs;
  }
}

export default SchemeRegistrarProposal;

export {
  InferredSchemeRegistrarProposal,
  SchemeRegistrarProposal,
  Entity as SchemeRegistrarProposalEntity,
  Data as SchemeRegistrarProposalData,
  useSchemeRegistrarProposal,
};
