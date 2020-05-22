import * as React from "react";
import { Queue as Entity, IQueueState as Data } from "@dorgtech/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  Component,
  ComponentLogs,
  ComponentProps,
  DAO,
  DAOEntity,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";

interface RequiredProps extends ComponentProps<Entity, Data> {
  // Address of the Queue Avatar
  id: string;
  dao?: string | DAOEntity;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredQueue extends Component<InferredProps, Entity, Data> {
  protected createEntity(): Entity {
    const { config, id, dao } = this.props;
    if (!config) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }

    if (!dao) {
      throw Error(
        "DAO Missing: Please provide this field as a prop, or use the inference component."
      );
    }

    const daoEntity: DAOEntity =
      typeof dao === "string" ? new DAOEntity(config.connection, dao) : dao;
    return new Entity(config.connection, id, daoEntity);
  }

  public static get Entity() {
    return CreateContextFeed(
      this.EntityContext.Consumer,
      this.LogsContext.Consumer,
      "Queue"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this.DataContext.Consumer,
      this.LogsContext.Consumer,
      "Queue"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this.LogsContext.Consumer,
      this.LogsContext.Consumer,
      "Queue"
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

function useQueue(): [Data | undefined, Entity | undefined] {
  const data = React.useContext<Data | undefined>(InferredQueue.DataContext);
  const entity = React.useContext<Entity | undefined>(
    InferredQueue.EntityContext
  );

  return [data, entity];
}

class Queue extends React.Component<RequiredProps> {
  public render() {
    const { id, children, dao } = this.props;

    return (
      <Protocol.Config>
        {(config: ProtocolConfig) => {
          if (dao) {
            return (
              <InferredQueue id={id} dao={dao} config={config}>
                {children}
              </InferredQueue>
            );
          } else {
            return (
              <DAO.Entity>
                {(entity: DAOEntity) => (
                  <InferredQueue id={id} dao={entity} config={config}>
                    {children}
                  </InferredQueue>
                )}
              </DAO.Entity>
            );
          }
        }}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return InferredQueue.Entity;
  }

  public static get Data() {
    return InferredQueue.Data;
  }

  public static get Logs() {
    return InferredQueue.Logs;
  }
}

export default Queue;

export {
  Queue,
  InferredQueue,
  Entity as QueueEntity,
  Data as QueueData,
  useQueue,
};
