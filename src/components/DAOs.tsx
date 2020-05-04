import * as React from "react";
import { Observable } from "rxjs";
import { IDAOQueryOptions as FilterOptions } from "@daostack/client";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  InferredDAO as Component,
  DAOEntity as Entity,
  DAOData as Data,
  CProps,
  ComponentList,
  ComponentListLogs,
  ComponentListProps,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";

type RequiredProps = ComponentListProps<Entity, Data, FilterOptions>;

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredDAOs extends ComponentList<InferredProps, Component> {
  createObservableEntities(): Observable<Entity[]> {
    const { config, filter } = this.props;
    if (!config) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }
    return Entity.search(config.connection, filter);
  }

  renderComponent(
    entity: Entity,
    children: any,
    index: number
  ): React.ComponentElement<CProps<Component>, any> {
    const { config } = this.props;

    return (
      <Component
        key={`${entity.id}_${index}`}
        address={entity.id}
        config={config}
      >
        {children}
      </Component>
    );
  }

  public static get Entities() {
    return CreateContextFeed(
      this._EntitiesContext.Consumer,
      this._LogsContext.Consumer,
      "DAOs"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "DAOs"
    );
  }

  protected static _EntitiesContext = React.createContext<Entity[] | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<
    ComponentListLogs | undefined
  >(undefined);
}

class DAOs extends React.Component<RequiredProps> {
  render() {
    const { children, sort, filter } = this.props;

    return (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredDAOs config={config} sort={sort} filter={filter}>
            {children}
          </InferredDAOs>
        )}
      </Protocol.Config>
    );
  }

  public static get Entities() {
    return InferredDAOs.Entities;
  }

  public static get Logs() {
    return InferredDAOs.Logs;
  }
}

export { DAOs };
