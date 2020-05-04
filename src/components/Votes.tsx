import * as React from "react";
import { Observable } from "rxjs";
import { IVoteQueryOptions as FilterOptions } from "@daostack/client";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  InferredVote as Component,
  VoteEntity as Entity,
  VoteData as Data,
  DAO,
  DAOEntity,
  Member,
  MemberEntity,
  Proposal,
  ProposalEntity,
  CProps,
  ComponentList,
  ComponentListLogs,
  ComponentListProps,
  applyScope,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";

type Scopes = "DAO" | "Member as voter" | "Proposal";

const scopeProps: Record<Scopes, string> = {
  DAO: "dao",
  "Member as voter": "voter",
  Proposal: "proposal",
};

interface RequiredProps
  extends ComponentListProps<Entity, Data, FilterOptions> {
  from?: Scopes;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
  dao?: string;
  voter?: string;
  proposal?: string;
}

class InferredVotes extends ComponentList<InferredProps, Component> {
  createObservableEntities(): Observable<Entity[]> {
    const { config, from, filter } = this.props;

    if (!config) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }

    const f = applyScope(filter, from, scopeProps, this.props);
    return Entity.search(config.connection, f);
  }

  renderComponent(
    entity: Entity,
    children: any,
    index: number
  ): React.ComponentElement<CProps<Component>, any> {
    const { config } = this.props;

    if (!entity.id) {
      throw Error("Vote Entity ID undefined. This should never happen.");
    }

    return (
      <Component key={`${entity.id}_${index}`} id={entity.id} config={config}>
        {children}
      </Component>
    );
  }

  public static get Entities() {
    return CreateContextFeed(
      this._EntitiesContext.Consumer,
      this._LogsContext.Consumer,
      "Votes"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "Votes"
    );
  }

  protected static _EntitiesContext = React.createContext<Entity[] | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<
    ComponentListLogs | undefined
  >(undefined);
}

class Votes extends React.Component<RequiredProps> {
  render() {
    const { children, from, sort, filter } = this.props;

    return (
      <Protocol.Config>
        {(config: ProtocolConfig) => {
          switch (from) {
            case "DAO":
              return (
                <DAO.Entity>
                  {(dao: DAOEntity) => (
                    <InferredVotes
                      dao={dao.id}
                      config={config}
                      sort={sort}
                      filter={filter}
                    >
                      {children}
                    </InferredVotes>
                  )}
                </DAO.Entity>
              );
            case "Member as voter":
              return (
                <Member.Entity>
                  {(voter: MemberEntity) => {
                    if (!voter.id) {
                      throw Error(
                        "Member Entity ID undefined. This should never happen."
                      );
                    }
                    return (
                      <InferredVotes
                        voter={voter.id}
                        config={config}
                        sort={sort}
                        filter={filter}
                      >
                        {children}
                      </InferredVotes>
                    );
                  }}
                </Member.Entity>
              );
            case "Proposal":
              return (
                <Proposal.Entity>
                  {(proposal: ProposalEntity) => (
                    <InferredVotes
                      proposal={proposal.id}
                      config={config}
                      sort={sort}
                      filter={filter}
                    >
                      {children}
                    </InferredVotes>
                  )}
                </Proposal.Entity>
              );
            default:
              if (from) {
                throw Error(`Unsupported scope: ${from}`);
              }

              return (
                <InferredVotes config={config} sort={sort} filter={filter}>
                  {children}
                </InferredVotes>
              );
          }
        }}
      </Protocol.Config>
    );
  }

  public static get Entities() {
    return InferredVotes.Entities;
  }

  public static get Logs() {
    return InferredVotes.Logs;
  }
}

export default Votes;

export { Votes, InferredVotes };
