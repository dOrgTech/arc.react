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
      this.EntityContext.Consumer,
      this.LogsContext.Consumer,
      "Vote"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this.DataContext.Consumer,
      this.LogsContext.Consumer,
      "Vote"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this.LogsContext.Consumer,
      this.LogsContext.Consumer,
      "Vote"
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

function useVote(): [Data | undefined, Entity | undefined] {
  const data = React.useContext<Data | undefined>(InferredVote.DataContext);
  const entity = React.useContext<Entity | undefined>(
    InferredVote.EntityContext
  );

  return [data, entity];
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

export { Vote, InferredVote, Entity as VoteEntity, Data as VoteData, useVote };
