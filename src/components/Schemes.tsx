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
  DAO,
  DAOEntity,
  InferredScheme as Component,
  SchemeEntity as Entity,
  SchemeData as Data
} from "./";
import {
  ISchemeQueryOptions as FilterOptions
} from "@daostack/client";

interface RequiredProps extends ComponentListProps<Entity, Data, FilterOptions> {
  scope?: "DAO";
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

interface DAOScopedProps extends InferredProps {
  dao: string;
}

class InferredSchemes extends ComponentList<InferredProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { config, filter } = this.props;
    return Entity.search(config.connection, filter);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    const { config } = this.props;

    return (
      <Component id={entity.id} config={config}>
      {children}
      </Component>
    );
  }
}

class DAOScopedSchemes extends ComponentList<DAOScopedProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { dao, config, filter } = this.props;

    const daoFilter: FilterOptions = filter ? filter : { where: { } };
    if (!daoFilter.where) {
      daoFilter.where = { };
    }
    daoFilter.where.dao = dao;

    return Entity.search(config.connection, daoFilter);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    const { config } = this.props;
    return (
      <Component id={entity.id} config={config}>
      {children}
      </Component>
    )
  }
}

class Schemes extends React.Component<RequiredProps>
{
  render() {
    const { children, scope, sort, filter } = this.props;

    return (
      <Protocol.Config>
      {(config: ProtocolConfig) => {
        switch (scope) {
          case "DAO":
            return (
              <DAO.Entity>
              {(dao: DAOEntity) => (
                <DAOScopedSchemes dao={dao.id} config={config} sort={sort} filter={filter}>
                {children}
                </DAOScopedSchemes>
              )}
              </DAO.Entity>
            );
          default:
            return (
              <InferredSchemes config={config} sort={sort} filter={filter}>
              {children}
              </InferredSchemes>
            );
        }
      }}
      </Protocol.Config>
    );
  }
}

export default Schemes;

export {
  Schemes
};
