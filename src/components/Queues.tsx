import * as React from "react";
import { Observable } from "rxjs";
import { IQueueQueryOptions as FilterOptions } from "@daostack/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  DAO,
  DAOEntity,
  InferredQueue as Component,
  QueueEntity as Entity,
  QueueData as Data,
  CProps,
  ComponentList,
  ComponentListLogs,
  ComponentListProps,
  createFilterFromScope,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";

type Scopes = "DAO";

const scopeProps: Record<Scopes, string> = {
  DAO: "dao",
};

interface RequiredProps extends ComponentListProps<Entity, FilterOptions> {
  from?: Scopes;
  dao?: DAOEntity | string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredQueues extends ComponentList<InferredProps, Component> {
  createObservableEntities(): Observable<Entity[]> {
    const { config, from, filter } = this.props;
    if (!config) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }

    const f = createFilterFromScope(filter, from, scopeProps, this.props);
    return Entity.search(config.connection, f);
  }

  renderComponent(
    entity: Entity,
    children: any,
    index: number
  ): React.ComponentElement<CProps<Component>, any> {
    const { config, dao } = this.props;
    return (
      <Component
        key={`${entity.id}_${index}`}
        dao={dao}
        id={entity.id}
        config={config}
        entity={entity}
      >
        {children}
      </Component>
    );
  }

  public static get Entities() {
    return CreateContextFeed(
      this.EntitiesContext.Consumer,
      this.LogsContext.Consumer,
      "Queues"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this.LogsContext.Consumer,
      this.LogsContext.Consumer,
      "Queues"
    );
  }

  protected static EntitiesContext = React.createContext<Entity[] | undefined>(
    undefined
  );
  protected static LogsContext = React.createContext<
    ComponentListLogs | undefined
  >(undefined);
}

class Queues extends React.Component<RequiredProps> {
  render() {
    const { children, sort, from, filter } = this.props;

    return (
      <Protocol.Config>
        {(config: ProtocolConfig) => {
          switch (from) {
            case "DAO":
              return (
                <DAO.Entity>
                  {(dao: DAOEntity) => (
                    <InferredQueues
                      dao={dao.id}
                      config={config}
                      sort={sort}
                      filter={filter}
                    >
                      {children}
                    </InferredQueues>
                  )}
                </DAO.Entity>
              );
            default:
              if (from) {
                throw Error(`Unsupported scope: ${from}`);
              }

              return (
                <InferredQueues config={config} sort={sort} filter={filter}>
                  {children}
                </InferredQueues>
              );
          }
        }}
      </Protocol.Config>
    );
  }

  public static get Entities() {
    return InferredQueues.Entities;
  }

  public static get Logs() {
    return InferredQueues.Logs;
  }
}

export default Queues;

export { Queues, InferredQueues };
