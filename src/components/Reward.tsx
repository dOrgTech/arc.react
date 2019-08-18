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
  Reward as Entity,
  IRewardState as Data
} from "@daostack/client";

// TODO
type Code = { }

interface RequiredProps extends BaseProps {
  // Reward ID
  id: string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredReward extends Component<InferredProps, Entity, Data, Code>
{
  protected createEntity(): Entity {
    const { id, config } = this.props;
    return new Entity(id, config.connection);
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

class Reward extends React.Component<RequiredProps>
{
  public render() {
    const { id, children } = this.props;

    return (
      <Protocol.Config>
      {(config: ProtocolConfig) => (
        <InferredReward id={id} config={config}>
        {children}
        </InferredReward>
      )}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return InferredReward.Entity;
  }

  public static get Data() {
    return InferredReward.Data;
  }

  public static get Code() {
    return InferredReward.Code;
  }

  public static get Logs() {
    return InferredReward.Logs;
  }
}

export default Reward;

export {
  Reward,
  InferredReward,
  Entity as RewardEntity,
  Data   as RewardData,
  Code   as RewardCode,
  ComponentLogs
};
