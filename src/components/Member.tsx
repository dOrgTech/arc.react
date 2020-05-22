import * as React from "react";
import { Member as Entity, IMemberState as Data } from "@dorgtech/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  DAO,
  DAOEntity,
  Component,
  ComponentLogs,
  ComponentProps,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";

interface RequiredProps extends ComponentProps<Entity, Data> {
  // Address of the member
  address: string;
  dao?: string | DAOEntity;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredMember extends Component<InferredProps, Entity, Data> {
  protected async createEntity(): Promise<Entity> {
    const { address, dao, config } = this.props;

    if (!dao) {
      throw Error(
        "DAO Missing: Please provide this field as a prop, or use the inference component."
      );
    }

    const daoEntity: DAOEntity =
      typeof dao === "string" ? new DAOEntity(config.connection, dao) : dao;

    const daoState = await daoEntity.fetchState();

    const memberId: string = Entity.calculateId({
      contract: daoState.reputation.id,
      address,
    });

    return new Entity(config.connection, memberId);
  }

  public static get Entity() {
    return CreateContextFeed(
      this.EntityContext.Consumer,
      this.LogsContext.Consumer,
      "Member"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this.DataContext.Consumer,
      this.LogsContext.Consumer,
      "Member"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this.LogsContext.Consumer,
      this.LogsContext.Consumer,
      "Member"
    );
  }

  public static EntityContext = React.createContext<Entity | undefined>(
    undefined
  );
  public static DataContext = React.createContext<Data | undefined>(undefined);
  public static LogsContext = React.createContext<ComponentLogs | undefined>(
    undefined
  );
}

function useMember(): [Data | undefined, Entity | undefined] {
  const data = React.useContext<Data | undefined>(InferredMember.DataContext);
  const entity = React.useContext<Entity | undefined>(
    InferredMember.EntityContext
  );

  return [data, entity];
}

class Member extends React.Component<RequiredProps> {
  public render() {
    const { address, dao, children } = this.props;

    return (
      <Protocol.Config>
        {(config: ProtocolConfig) => {
          if (dao) {
            return (
              <InferredMember address={address} dao={dao} config={config}>
                {children}
              </InferredMember>
            );
          } else {
            return (
              <DAO.Entity>
                {(entity: DAOEntity) => (
                  <InferredMember
                    address={address}
                    dao={entity}
                    config={config}
                  >
                    {children}
                  </InferredMember>
                )}
              </DAO.Entity>
            );
          }
        }}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return InferredMember.Entity;
  }

  public static get Data() {
    return InferredMember.Data;
  }

  public static get Logs() {
    return InferredMember.Logs;
  }
}

export default Member;

export {
  Member,
  InferredMember,
  Entity as MemberEntity,
  Data as MemberData,
  useMember,
};
