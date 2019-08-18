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
  InferredMember as Component,
  MemberEntity as Entity,
  MemberData as Data
} from "./";
import {
  IMemberQueryOptions as FilterOptions
} from "@daostack/client";

interface RequiredProps extends ComponentListProps<Entity, Data, FilterOptions> {
  scope?: "DAO";
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

interface DAOScopeProps extends InferredProps {
  dao: string;
}

class InferredMembers extends ComponentList<InferredProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { config, filter } = this.props;
    return Entity.search(config.connection, filter);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    const { config } = this.props;
    // TODO: support creating Components with just an Entity, it makes no sense to recreate the Member entity here...
    return (
      <Component address={entity.staticState!.address} dao={entity.staticState!.dao} config={config}>
      {children}
      </Component>
    );
  }
}

class DAOScopeMembers extends ComponentList<DAOScopeProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { dao, config, filter } = this.props;

    if (!config) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }

    const daoFilter: FilterOptions = filter ? filter : { where: { } };
    if (!daoFilter.where) {
      daoFilter.where = { };
    }
    daoFilter.where.dao = dao;

    return Entity.search(config.connection, daoFilter);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    const { dao, config } = this.props;
    return (
      <Component address={entity.staticState!.address} dao={dao} config={config}>
      {children}
      </Component>
    );
  }
}

class Members extends React.Component<RequiredProps>
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
                <DAOScopeMembers dao={dao.id} config={config} sort={sort} filter={filter}>
                {children}
                </DAOScopeMembers>
              )}
              </DAO.Entity>
            );
          default:
            return (
              <InferredMembers config={config} sort={sort} filter={filter}>
              {children}
              </InferredMembers>
            );
        }
      }}
      </Protocol.Config>
    );
  }
}

export default Members;

export {
  Members
};
