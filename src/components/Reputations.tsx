import * as React from "react";
import { Observable } from "rxjs";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  InferredReputation as Component,
  ReputationEntity as Entity,
  ReputationData as Data,
  CProps,
  ComponentList,
  ComponentListLogs,
  ComponentListProps,
} from "../";

import { IReputationQueryOptions as FilterOptions } from "@dorgtech/arc.js";
import { CreateContextFeed } from "../runtime/ContextFeed";

type RequiredProps = ComponentListProps<Entity, FilterOptions>;

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredReputations extends ComponentList<InferredProps, Component> {
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
        address={entity.address}
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
      "Reputations"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "Reputations"
    );
  }

  protected static _EntitiesContext = React.createContext<Entity[] | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<
    ComponentListLogs | undefined
  >(undefined);
}

class Reputations extends React.Component<RequiredProps> {
  render() {
    const { children, sort, filter } = this.props;

    return (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredReputations config={config} sort={sort} filter={filter}>
            {children}
          </InferredReputations>
        )}
      </Protocol.Config>
    );
  }

  public static get Entities() {
    return InferredReputations.Entities;
  }

  public static get Logs() {
    return InferredReputations.Logs;
  }
}

export default Reputations;

export { Reputations, InferredReputations };
