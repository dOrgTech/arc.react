import * as React from "react";
import { 
  SchemeRegistrarProposal as Entity,
  ISchemeRegistrarProposalState as Data 
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
      this._EntityContext.Consumer,
      this._LogsContext.Consumer,
      "SchemeRegistrarProposal"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this._DataContext.Consumer,
      this._LogsContext.Consumer,
      "SchemeRegistrarProposal"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "SchemeRegistrarProposal"
    );
  }

  protected static _EntityContext = React.createContext<Entity | undefined>(
    undefined
  );
  protected static _DataContext = React.createContext<Data | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<
    ComponentLogs | undefined
  >(undefined);
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
  Data as SchemeRegistrarProposalData
};
