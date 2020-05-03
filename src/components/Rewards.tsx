import * as React from "react";
import { Observable } from "rxjs";
import { IRewardQueryOptions as FilterOptions } from "@daostack/client";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  ArcReward as Component,
  RewardEntity as Entity,
  RewardData as Data,
  CProps,
  ComponentList,
  ComponentListLogs,
  ComponentListProps,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";

type RequiredProps = ComponentListProps<Entity, Data, FilterOptions>;

interface InferredProps {
  arcConfig: ProtocolConfig | undefined;
}

type Props = RequiredProps & InferredProps;

class ArcRewards extends ComponentList<Props, Component> {
  createObservableEntities(): Observable<Entity[]> {
    const { arcConfig, filter } = this.props;
    if (!arcConfig) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }
    return Entity.search(arcConfig.connection, filter);
  }

  renderComponent(
    entity: Entity,
    children: any
  ): React.ComponentElement<CProps<Component>, any> {
    const { arcConfig } = this.props;

    return (
      <Component key={entity.id} id={entity.id} arcConfig={arcConfig}>
        {children}
      </Component>
    );
  }

  public static get Entities() {
    return CreateContextFeed(
      this._EntitiesContext.Consumer,
      this._LogsContext.Consumer,
      "Rewards"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "Rewards"
    );
  }

  protected static _EntitiesContext = React.createContext<Entity[] | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<
    ComponentListLogs | undefined
  >(undefined);
}

class Rewards extends React.Component<RequiredProps> {
  render() {
    const { children, sort, filter } = this.props;

    return (
      <Protocol.Config>
        {(arc: ProtocolConfig) => (
          <ArcRewards arcConfig={arc} sort={sort} filter={filter}>
            {children}
          </ArcRewards>
        )}
      </Protocol.Config>
    );
  }

  public static get Entities() {
    return ArcRewards.Entities;
  }

  public static get Logs() {
    return ArcRewards.Logs;
  }
}

export default Rewards;

export { ArcRewards, Rewards };
