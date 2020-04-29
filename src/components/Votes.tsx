import * as React from "react";
import { Observable } from "rxjs";
import { CProps, ComponentList, ComponentListProps } from "../runtime";
import { Arc as Protocol, ArcConfig as ProtocolConfig } from "../protocol";
import { CreateContextFeed } from "../runtime/ContextFeed";
import {
  ArcVote as Component,
  VoteEntity as Entity,
  VoteData as Data,
} from "./";
import { IVoteQueryOptions as FilterOptions } from "@daostack/client";

type RequiredProps = ComponentListProps<Entity, Data, FilterOptions>;

interface InferredProps {
  arcConfig: ProtocolConfig | undefined;
}

type Props = RequiredProps & InferredProps;

class ArcVotes extends ComponentList<Props, Component> {
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

    if (!entity.id) {
      throw Error("Vote Entity ID undefined. This should never happen.");
    }

    return (
      <Component id={entity.id} arcConfig={arcConfig}>
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

class Votes extends React.Component<RequiredProps> {
  render() {
    const { children, sort, filter } = this.props;

    return (
      <Protocol.Config>
        {(arc: ProtocolConfig) => (
          <ArcVotes arcConfig={arc} sort={sort} filter={filter}>
            {children}
          </ArcVotes>
        )}
      </Protocol.Config>
    );
  }

  public static get Entities() {
    return ArcVotes.Entities;
  }

  public static get Logs() {
    return ArcVotes.Logs;
  }
}

export default Votes;

export { ArcVotes, Votes };
