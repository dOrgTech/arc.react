import * as React from "react";
import { Observable } from "rxjs";
import {
  CProps,
  ComponentList,
  ComponentListProps
} from "../runtime";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig
} from "../protocol";
import {
  InferredReputation as Component,
  ReputationEntity as Entity,
  ReputationData as Data
} from "./";
import {
  IReputationQueryOptions as FilterOptions
} from "@daostack/client";

interface RequiredProps extends ComponentListProps<Entity, Data, FilterOptions> { }

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredReputations extends ComponentList<InferredProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { config, filter } = this.props;
    return Entity.search(config.connection, filter);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    const { config } = this.props;

    return (
      <Component address={entity.address} config={config}>
      {children}
      </Component>
    );
  }
}

class Reputations extends React.Component<RequiredProps>
{
  render() {
    const { children, sort, filter } = this.props;

    return (
      <Protocol.Config>
      {(config: ProtocolConfig) =>
        <InferredReputations config={config} sort={sort} filter={filter}>
        {children}
        </InferredReputations>
      }
      </Protocol.Config>
    );
  }
}

export default Reputations;

export {
  Reputations
};
