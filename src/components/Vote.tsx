import * as React from "react";
import { Component, ComponentLogs } from "../runtime";
import { CreateContextFeed } from "../runtime/ContextFeed";
import { Arc as Protocol, ArcConfig as ProtocolConfig } from "../protocol";
import { Vote as Entity, IVoteState as Data } from "@dorgtech/arc.js";

interface RequiredProps {
  // Vote ID
  id: string;
  noSub?: boolean;
}

interface InferredProps {
  // Arc Instance
  arcConfig: ProtocolConfig | undefined;
}

type Props = RequiredProps & InferredProps;

class ArcVote extends Component<Props, Entity, Data> {
  protected createEntity(): Entity {
    const { arcConfig, id } = this.props;

    if (!arcConfig) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }

    return new Entity(arcConfig.connection, id);
  }

  protected async initialize(entity: Entity | undefined): Promise<void> {
    if (entity) {
      await entity.fetchState();
    }

    return Promise.resolve();
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
        {(arc: ProtocolConfig) => (
          <ArcVote id={id} arcConfig={arc}>
            {children}
          </ArcVote>
        )}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return ArcVote.Entity;
  }

  public static get Data() {
    return ArcVote.Data;
  }

  public static get Logs() {
    return ArcVote.Logs;
  }
}

export default Vote;

export {
  ArcVote,
  Vote,
  Props as VoteProps,
  Entity as VoteEntity,
  Data as VoteData,
};
