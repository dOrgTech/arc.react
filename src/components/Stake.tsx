import * as React from "react";
import { Component, ComponentLogs } from "../runtime";
import { CreateContextFeed } from "../runtime/ContextFeed";
import { Arc as Protocol, ArcConfig as ProtocolConfig } from "../protocol";
import { Stake as Entity, IStakeState as Data } from "@daostack/client";

interface RequiredProps {
  // Stake ID
  id: string;
}

interface InferredProps {
  // Arc Instance
  arcConfig: ProtocolConfig | undefined;
}

type Props = RequiredProps & InferredProps;

class ArcStake extends Component<Props, Entity, Data> {
  protected createEntity(): Entity {
    const { arcConfig, id } = this.props;

    if (!arcConfig) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }

    return new Entity(id, arcConfig.connection);
  }

  protected async initialize(entity: Entity | undefined): Promise<void> {
    if (entity) {
      await entity.fetchStaticState();
    }

    return Promise.resolve();
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

  protected static _EntityContext = React.createContext<{} | undefined>(
    undefined
  );
  protected static _DataContext = React.createContext<{} | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<{} | undefined>({});
}

class Stake extends React.Component<RequiredProps> {
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

  public static get Logs() {
    return ArcStake.Logs;
  }
}

export default Stake;

export {
  ArcStake,
  Stake,
  Props as StakeProps,
  Entity as StakeEntity,
  Data as StakeData,
  ComponentLogs,
};
