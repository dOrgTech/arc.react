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
  Arc as Protocol,
  ArcConfig as ProtocolConfig
} from "../protocol";
import {
  Proposal as Entity,
  IProposalState as Data
} from "@daostack/client";

// TODO
type Code = { }

interface RequiredProps extends BaseProps {
  // Proposal ID
  id: string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredProposal extends Component<InferredProps, Entity, Data, Code>
{
  protected createEntity(): Entity {
    const { config, id } = this.props;
    return new Entity(id, config.connection);
  }

  protected async initialize(entity: Entity): Promise<void> {
    // TODO: remove this when this issue is resolved: https://github.com/daostack/client/issues/291
    entity.staticState = undefined;
    await entity.fetchStaticState();
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
      <Protocol.Config>
      {(config: ProtocolConfig) => (
        <InferredProposal id={id} config={config}>
        {children}
        </InferredProposal>
      )}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return InferredProposal.Entity;
  }

  public static get Data() {
    return InferredProposal.Data;
  }

  public static get Code() {
    return InferredProposal.Code;
  }

  public static get Logs() {
    return InferredProposal.Logs;
  }
}

export default Proposal;

export {
  InferredProposal,
  Proposal,
  Entity as ProposalEntity,
  Data   as ProposalData,
  Code   as ProposalCode,
  ComponentLogs
};
