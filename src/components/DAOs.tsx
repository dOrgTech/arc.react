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
  InferredDAO as Component,
  DAOEntity as Entity,
  DAOData as Data
} from "./";
import {
  IDAOQueryOptions as FilterOptions
} from "@daostack/client";

interface RequiredProps extends ComponentListProps<Entity, Data, FilterOptions> { }

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredDAOs extends ComponentList<InferredProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { config, filter } = this.props;
    return Entity.search(config.connection, filter);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    const { config } = this.props;

    return (
      <Component address={entity.id} config={config}>
      {children}
      </Component>
    );
  }
}

class DAOs extends React.Component<RequiredProps>
{
  render() {
    const { children, sort, filter } = this.props;

    return (
      <Protocol.Config>
      {(config: ProtocolConfig) =>
        <InferredDAOs config={config} sort={sort} filter={filter}>
        {children}
        </InferredDAOs>
      }
      </Protocol.Config>
    );
  }
}

export default DAOs;

export {
  DAOs
};
