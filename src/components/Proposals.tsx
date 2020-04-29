import * as React from "react";
import { Observable } from "rxjs";
import { CProps, ComponentList, ComponentListProps } from "../runtime";
import { Arc as Protocol, ArcConfig as ProtocolConfig } from "../protocol";
import {
  DAO as InferComponent,
  DAOEntity as InferEntity,
  ArcProposal as Component,
  ProposalEntity as Entity,
  ProposalData as Data,
} from "./";
import { CreateContextFeed } from "../runtime/ContextFeed";
import { IProposalQueryOptions as FilterOptions } from "@daostack/client";

interface RequiredProps
  extends ComponentListProps<Entity, Data, FilterOptions> {
  allDAOs?: boolean;
  inferred?: boolean;
}

interface ArcInferredProps {
  arcConfig?: ProtocolConfig | undefined;
}

interface DAOInferredProps {
  dao?: InferEntity | undefined;
}

// TODO: SchemeProposals

type ArcProps = RequiredProps & ArcInferredProps & DAOInferredProps;

class ArcProposals extends ComponentList<ArcProps, Component> {
  createObservableEntities(): Observable<Entity[]> {
    const { arcConfig, filter, dao, inferred } = this.props;

    if (inferred) {
      if (Object.keys(dao!).length) {
        throw Error(
          "DAO Entity Missing: Please provide this field as a prop, or use the inference component."
        );
      }
      const daoFilter: FilterOptions = filter ? filter : { where: {} };
      if (!daoFilter.where) {
        daoFilter.where = {};
      }
      daoFilter.where.dao = dao!.id;

      return Entity.search(dao!.context, daoFilter);
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
    return (
      <Component id={entity.id} arcConfig={this.props.arcConfig}>
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

  protected static _EntitiesContext = React.createContext({});
  protected static _LogsContext = React.createContext({});
}

class Proposals extends React.Component<RequiredProps> {
  render() {
    const { children, allDAOs, sort, filter } = this.props;

    if (allDAOs) {
      return (
        <Protocol.Config>
          {(arc: ProtocolConfig) => (
            <ArcProposals
              inferred={false}
              arcConfig={arc}
              sort={sort}
              filter={filter}
            >
              {children}
            </ArcProposals>
          )}
        </Protocol.Config>
      );
    } else {
      return (
        <Protocol.Config>
          <InferComponent.Entity>
            {(arc: ProtocolConfig, dao: InferEntity) => (
              <ArcProposals
                inferred={true}
                arcConfig={arc}
                dao={dao}
                sort={sort}
                filter={filter}
              >
                {children}
              </ArcProposals>
            )}
          </InferComponent.Entity>
        </Protocol.Config>
      );
    }
  }

  public static get Entities() {
    return ArcProposals.Entities;
  }

  public static get Logs() {
    return ArcProposals.Logs;
  }
}

export default Proposals;

export { ArcProposals, Proposals };
