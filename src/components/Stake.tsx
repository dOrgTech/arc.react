import * as React from "react";
import { Stake as Entity, IStakeState as Data } from "@dorgtech/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  Component,
  ComponentLogs,
  ComponentProps,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";

interface RequiredProps extends ComponentProps<Entity, Data> {
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

    return new Entity(config.connection, id);
  }

  public static get Entity() {
    return CreateContextFeed(
      this.EntityContext.Consumer,
      this.LogsContext.Consumer,
      "Stake"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this.DataContext.Consumer,
      this.LogsContext.Consumer,
      "Stake"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this.LogsContext.Consumer,
      this.LogsContext.Consumer,
      "Stake"
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

function useStake(): [Data | undefined, Entity | undefined] {
  const data = React.useContext<Data | undefined>(InferredStake.DataContext);
  const entity = React.useContext<Entity | undefined>(
    InferredStake.EntityContext
  );

  return [data, entity];
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

export {
  Stake,
  InferredStake,
  Entity as StakeEntity,
  Data as StakeData,
  useStake,
};
