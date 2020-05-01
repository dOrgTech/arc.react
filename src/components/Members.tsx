import * as React from "react";
import { Observable } from "rxjs";
import { CProps, ComponentList, ComponentListProps } from "../runtime";
import { CreateContextFeed } from "../runtime/ContextFeed";
import { Arc as Protocol, ArcConfig as ProtocolConfig } from "../protocol";
import {
  DAO as InferComponent,
  DAOEntity as InferEntity,
  DAOMember as Component,
  MemberEntity as Entity,
  MemberData as Data,
} from "./";
import { IMemberQueryOptions as FilterOptions } from "@daostack/client";

// TODO: find better way of handling inference... this gets complicated when there are multiple
// points of inferrance such as votes (MemberVotes, DAOVotes, ProposalVotes). Maybe have a prop
// that is <Votes inferFrom={"Member"}
interface RequiredProps
  extends ComponentListProps<Entity, Data, FilterOptions> {
  allDAOs?: boolean;
}

interface ArcInferredProps {
  arcConfig: ProtocolConfig | undefined;
}

interface DAOInferredProps {
  dao: InferEntity | undefined;
}

type ArcProps = RequiredProps & ArcInferredProps;
type DAOProps = RequiredProps & DAOInferredProps & ArcInferredProps;

class ArcMembers extends ComponentList<ArcProps, Component> {
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
    // TODO: support creating Components with just an Entity, it makes no sense to recreate the Member entity here...
    return (
      <Component
        key={entity.staticState!.address}
        address={entity.staticState!.address}
        dao={new InferEntity(entity.staticState!.dao, entity.context)}
      >
        {children}
      </Component>
    );
  }
}

class DAOMembers extends ComponentList<DAOProps, Component> {
  // TODO: remove this when filters are added
  // also rename all instances of "Arc" to protocol?
  createObservableEntities(): Observable<Entity[]> {
    const { dao, filter } = this.props;

    if (!dao) {
      throw Error(
        "DAO Missing Entity: Please provide this field as a prop, or use the inference component."
      );
    }

    const daoFilter: FilterOptions = filter ? filter : { where: {} };
    if (!daoFilter.where) {
      daoFilter.where = {};
    }
    daoFilter.where.dao = dao.id;

    return Entity.search(dao.context, daoFilter);
  }

  renderComponent(
    entity: Entity,
    children: any
  ): React.ComponentElement<CProps<Component>, any> {
    const { dao } = this.props;

    return (
      <Component
        key={entity.staticState!.address}
        address={entity.staticState!.address as string}
        dao={dao}
      >
        {children}
      </Component>
    );
  }

  public static get Entities() {
    return CreateContextFeed(
      this._EntitiesContext.Consumer,
      this._LogsContext.Consumer
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer
    );
  }

  protected static _EntitiesContext = React.createContext<{} | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<{} | undefined>(
    undefined
  );
}

class Members extends React.Component<RequiredProps> {
  render() {
    const { children, allDAOs, sort, filter } = this.props;
    if (allDAOs) {
      return (
        <Protocol.Config>
          {(arcConfig: ProtocolConfig) => (
            <ArcMembers arcConfig={arcConfig} sort={sort} filter={filter}>
              {children}
            </ArcMembers>
          )}
        </Protocol.Config>
      );
    } else {
      return (
        <Protocol.Config>
          <InferComponent.Entity>
            {(arc: ProtocolConfig, dao: InferEntity) => (
              <DAOMembers dao={dao} sort={sort} arcConfig={arc} filter={filter}>
                {children}
              </DAOMembers>
            )}
          </InferComponent.Entity>
        </Protocol.Config>
      );
    }
  }

  public static get Entities() {
    // TODO: this is a bug, will be fixed in the infer-prop branch
    return DAOMembers.Entities;
  }

  public static get Logs() {
    return DAOMembers.Logs;
  }
}

export default Members;

export { ArcMembers, DAOMembers, Members };
