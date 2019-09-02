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
  Vote as Entity,
  IVoteState as Data
} from "@daostack/client";

// TODO
type Code = { }

interface RequiredProps extends BaseProps {
  // Vote ID
  id: string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredVote extends Component<InferredProps, Entity, Data, Code>
{
  protected createEntity(): Entity {
    const { config, id } = this.props;
    return new Entity(id, config.connection);
  }

  protected async initialize(entity: Entity): Promise<void> {
    // TODO: this is a bug, fix it...
    entity.staticState = undefined;
    entity.staticState = await entity.fetchStaticState();
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

class Vote extends React.Component<RequiredProps>
{
  public render() {
    const { id, children } = this.props;

    return (
      <Protocol.Config>
      {(config: ProtocolConfig) => (
        <InferredVote id={id} config={config}>
        {children}
        </InferredVote>
      )}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return InferredVote.Entity;
  }

  public static get Data() {
    return InferredVote.Data;
  }

  public static get Code() {
    return InferredVote.Code;
  }

  public static get Logs() {
    return InferredVote.Logs;
  }
}

export default Vote;

export {
  Vote,
  InferredVote,
  Entity as VoteEntity,
  Data   as VoteData,
  Code   as VoteCode,
  ComponentLogs
};
