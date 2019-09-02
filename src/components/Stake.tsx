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
  Stake as Entity,
  IStakeState as Data
} from "@daostack/client";

// TODO
type Code = { }

interface RequiredProps extends BaseProps {
  // Stake ID
  id: string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredStake extends Component<InferredProps, Entity, Data, Code>
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

class Stake extends React.Component<RequiredProps>
{
  public render() {
    const { id, children } = this.props;

    return (
      <Protocol.Config>
      {(config: ProtocolConfig) => (
        <InferredStake id={id} config={config}>
        {children}
        </InferredStake>
      )}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return InferredStake.Entity;
  }

  public static get Data() {
    return InferredStake.Data;
  }

  public static get Code() {
    return InferredStake.Code;
  }

  public static get Logs() {
    return InferredStake.Logs;
  }
}

export default Stake;

export {
  Stake,
  InferredStake,
  Entity as StakeEntity,
  Data   as StakeData,
  Code   as StakeCode,
  ComponentLogs
};
