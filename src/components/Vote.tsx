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

interface InferredProps {
  // Arc Instance
  arcConfig: ProtocolConfig;
}

type Props = RequiredProps & InferredProps;

class ArcVote extends Component<Props, Entity, Data, Code>
{
  protected createEntity(): Entity {
    const { arcConfig, id } = this.props;
    return new Entity(id, arcConfig.connection);
  }

  protected async initialize(entity: Entity | undefined): Promise<void> {
    if (entity) {
      await entity.fetchStaticState();
    }

    return Promise.resolve();
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

  public static get Code() {
    return ArcVote.Code;
  }

  public static get Logs() {
    return ArcVote.Logs;
  }
}

export default Vote;

export {
  ArcVote,
  Vote,
  Props  as VoteProps,
  Entity as VoteEntity,
  Data   as VoteData,
  Code   as VoteCode,
  ComponentLogs
};
