import * as React from "react";
import { Vote as Entity, IVoteState as Data } from "@dorgtech/arc.js";
import { Component, ComponentLogs, ComponentProps } from "../runtime";
import { CreateContextFeed } from "../runtime/ContextFeed";
import { Arc as Protocol, ArcConfig as ProtocolConfig } from "../protocol";

interface RequiredProps extends ComponentProps<Entity, Data> {
  // Vote ID
  id: string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredVote extends Component<InferredProps, Entity, Data> {
  protected createEntity(): Entity {
    const { config, id } = this.props;

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
      "Vote"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this._DataContext.Consumer,
      this._LogsContext.Consumer,
      "Vote"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "Vote"
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

class Vote extends React.Component<RequiredProps> {
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

  public static get Logs() {
    return InferredVote.Logs;
  }
}

export default Vote;

export { Vote, InferredVote, Entity as VoteEntity, Data as VoteData };
