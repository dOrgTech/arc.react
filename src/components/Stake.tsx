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

interface InferredProps {
  // Arc Instance
  arcConfig: ProtocolConfig;
}

type Props = RequiredProps & InferredProps;

class ArcStake extends Component<Props, Entity, Data, Code>
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

class Stake extends React.Component<RequiredProps>
{
  public render() {
    const { id, children } = this.props;

    return (
      <Protocol.Config>
      {(arc: ProtocolConfig) => (
        <ArcStake id={id} arcConfig={arc}>
        {children}
        </ArcStake>
      )}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return ArcStake.Entity;
  }

  public static get Data() {
    return ArcStake.Data;
  }

  public static get Code() {
    return ArcStake.Code;
  }

  public static get Logs() {
    return ArcStake.Logs;
  }
}

export default Stake;

export {
  ArcStake,
  Stake,
  Props  as StakeProps,
  Entity as StakeEntity,
  Data   as StakeData,
  Code   as StakeCode,
  ComponentLogs
};
