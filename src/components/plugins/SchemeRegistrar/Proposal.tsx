import * as React from "react";
import {
  Proposal as BaseEntity,
  IProposalState as Data,
  SchemeRegistrarProposal as Entity,
} from "@dorgtech/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  Component,
  ComponentLogs,
} from "../../../";
import { CreateContextFeed } from "../../../runtime/ContextFeed";

interface RequiredProps {
  // Proposal ID
  id: string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
  noSub?: boolean;
}

class InferredPluginManagerProposal extends Component<
  InferredProps,
  BaseEntity<Data>,
  Data
> {
  protected async createEntity(): Promise<BaseEntity<Data>> {
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

class PluginManagerProposal extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;

    return (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredPluginManagerProposal id={id} config={config}>
            {children}
          </InferredPluginManagerProposal>
        )}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return InferredPluginManagerProposal.Entity;
  }

  public static get Data() {
    return InferredPluginManagerProposal.Data;
  }

  public static get Logs() {
    return InferredPluginManagerProposal.Logs;
  }
}

export default PluginManagerProposal;

export {
  InferredPluginManagerProposal,
  PluginManagerProposal,
  Entity as PluginManagerProposalEntity,
  BaseEntity as Proposal,
};
