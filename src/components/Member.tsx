import * as React from "react";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  DAO,
  DAOEntity,
  Component,
  ComponentLogs,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";
import {
  Member as Entity,
  IMemberState as Data,
  IDAOState as DAOData,
} from "@dorgtech/arc.js";

interface RequiredProps {
  // Address of the member
  address: string;
  // TODO: @cesar remove all of these, extend ComponentProps
  noSub?: boolean;
  dao?: string | DAOEntity;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredMember extends Component<InferredProps, Entity, Data> {
  protected async createEntity(): Promise<Entity> {
    const { address, dao, config } = this.props;

    if (dao) {
      const daoEntity: DAOEntity =
        typeof dao === "string" ? new DAOEntity(config.connection, dao) : dao;

      const daoState = await daoEntity.fetchState();

      const memberId: string = Entity.calculateId({
        contract: daoState.reputation.id,
        address,
      });

      return new Entity(config.connection, memberId);
    } else {
      throw Error(
        "DAO Missing: Please provide this field as a prop, or use the inference component."
      );
    }
  }

  public static get Entity() {
    return CreateContextFeed(
      this._EntityContext.Consumer,
      this._LogsContext.Consumer,
      "Member"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this._DataContext.Consumer,
      this._LogsContext.Consumer,
      "Member"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "Member"
    );
  }

  protected static _EntityContext = React.createContext<Entity | undefined>(
    undefined
  );
  protected static _DataContext = React.createContext<Data | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<
    ComponentLogs | undefined
  >(undefined);
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

export { Member, InferredMember, Entity as MemberEntity, Data as MemberData };
