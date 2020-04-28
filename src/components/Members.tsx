import * as React from "react";
import { Observable, throwError } from "rxjs";
import { CProps, ComponentList, ComponentListProps } from "../runtime";
import { Arc as Protocol, ArcConfig as ProtocolConfig } from "../protocol";
import { CreateContextFeed } from "../runtime/ContextFeed";
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
  inferred: boolean;
}

interface ArcInferredProps {
  arcConfig?: ProtocolConfig | undefined;
}

interface DAOInferredProps {
  dao?: InferEntity | undefined;
}

type ArcProps = RequiredProps & ArcInferredProps & DAOInferredProps;

class ArcMembers extends ComponentList<ArcProps, Component> {
  createObservableEntities(): Observable<Entity[]> {
    const { arcConfig, filter, dao, inferred } = this.props;
    if (inferred) {
      if (!dao) {
        throw Error(
          "DAO Entity Missing: Please provide this field as a prop, or use the inference component."
        );
      }

      const daoFilter: FilterOptions = filter ? filter : { where: {} };
      if (!daoFilter.where) {
        daoFilter.where = {};
      }
      daoFilter.where.dao = dao.id;

      return Entity.search(dao.context, daoFilter);
    } else {
      if (!arcConfig) {
        throw new Error(
          "Arc Config Missing: Please provide this field as a prop, or use the inference component."
        );
      }
      return Entity.search(arcConfig.connection, filter);
    }
  }
  renderComponent(
    entity: Entity,
    children: any
  ): React.ComponentElement<CProps<Component>, any> {
    // TODO: support creating Components with just an Entity, it makes no sense to recreate the Member entity here...
    return (
      <Component
        address={entity.staticState!.address}
        dao={new InferEntity(entity.staticState!.dao, entity.context)}
      >
        {children}
      </Component>
    );
  }

  public static get Entity() {
    return CreateContextFeed(
      this._EntityContext.Consumer,
      this._LogsContext.Consumer
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer
    );
  }
  protected static _LogsContext = React.createContext({});
  protected static _EntityContext = React.createContext({});
}

class Members extends React.Component<RequiredProps> {
  render() {
    const { children, allDAOs, sort, filter } = this.props;

    if (allDAOs) {
      return (
        <Protocol.Config>
          {(arcConfig: ProtocolConfig) => (
            <ArcMembers
              inferred={false}
              arcConfig={arcConfig}
              sort={sort}
              filter={filter}
            >
              {children}
            </ArcMembers>
          )}
        </Protocol.Config>
      );
    } else {
      return (
        <InferComponent.Entity>
          {(dao: InferEntity) => (
            <ArcMembers inferred={true} dao={dao} sort={sort} filter={filter}>
              {children}
            </ArcMembers>
          )}
        </InferComponent.Entity>
      );
    }
  }
  public static get Logs() {
    return ArcMembers.Logs;
  }

  public static get Entity() {
    return ArcMembers.Entity;
  }
}

export default Members;

export { ArcMembers, Members };
