import * as React from "react";
import {
  Proposal as BaseEntity,
  IProposalState as Data,
  GenericPluginProposal as Entity,
} from "@dorgtech/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  Component,
  ComponentLogs,
  ComponentProps,
} from "../../../";
import { CreateContextFeed } from "../../../runtime/ContextFeed";

interface RequiredProps extends ComponentProps {
  // Proposal ID
  id: string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredGenericPluginProposal extends Component<
  InferredProps,
  BaseEntity<Data>,
  Data
> {
  protected createEntity(): BaseEntity<Data> {
    const { config, id } = this.props;
    console.log(config);
    if (!config) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }

    return new Entity(config.connection, id);
  }

  public static get Entity() {
    return CreateContextFeed(
      this._EntityContext.Consumer,
      this._LogsContext.Consumer,
      "Proposal"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this._DataContext.Consumer,
      this._LogsContext.Consumer,
      "Proposal"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "Proposal"
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

class GenericPluginProposal extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;

    return (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredGenericPluginProposal id={id} config={config}>
            {children}
          </InferredGenericPluginProposal>
        )}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return InferredGenericPluginProposal.Entity;
  }

  public static get Data() {
    return InferredGenericPluginProposal.Data;
  }

  public static get Logs() {
    return InferredGenericPluginProposal.Logs;
  }
}

export default GenericPluginProposal;

export {
  InferredGenericPluginProposal,
  GenericPluginProposal,
  Entity as GenericPluginProposalEntity,
  Data as ProposalData,
};
