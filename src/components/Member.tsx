import * as React from "react";
import { Member as Entity, IMemberState as Data } from "@daostack/client";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  DAO,
  DAOEntity,
  Component,
  ComponentLogs,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";

interface RequiredProps {
  // Address of the member
  address: string;
  // Address of the DAO Avatar
  dao?: string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredMember extends Component<InferredProps, Entity, Data> {
  protected createEntity(): Entity {
    const { address, dao, config } = this.props;

    if (!dao) {
      throw Error(
        "DAO Address Missing: Please provide this field as a prop, or use the inference component."
      );
    }

    return new Entity({ address, dao }, config.connection);
  }

  protected async initialize(entity: Entity): Promise<void> {
    await entity.fetchStaticState();
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
                {(entity: DAOEntity | undefined) => (
                  <InferredMember
                    address={address}
                    dao={entity ? entity.id : undefined}
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
