import * as React from "react";
import { Stake as Entity, IStakeState as Data } from "@daostack/client";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  Component,
  ComponentLogs,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";

interface RequiredProps {
  // Stake ID
  id: string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredStake extends Component<InferredProps, Entity, Data> {
  protected createEntity(): Entity {
    const { config, id } = this.props;

    if (!config) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }

    return new Entity(id, config.connection);
  }

  protected async initialize(entity: Entity): Promise<void> {
    // TODO: remove this when this issue is resolved: https://github.com/daostack/client/issues/291
    entity.staticState = undefined;
    await entity.fetchStaticState();
  }

  public static get Entity() {
    return CreateContextFeed(
      this._EntityContext.Consumer,
      this._LogsContext.Consumer,
      "Stake"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this._DataContext.Consumer,
      this._LogsContext.Consumer,
      "Stake"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "Stake"
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

class Stake extends React.Component<RequiredProps> {
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

  public static get Logs() {
    return InferredStake.Logs;
  }
}

export default Stake;

export { Stake, InferredStake, Entity as StakeEntity, Data as StakeData };
