import * as React from "react";
import { Component, ComponentLogs } from "../runtime";
import { CreateContextFeed } from "../runtime/ContextFeed";
import { DAO, DAOEntity } from "./";
import { Member as Entity, IMemberState as Data } from "@dorgtech/arc.js";

interface RequiredProps {
  // Address of the member
  address: string;
}

interface InferredProps {
  // The DAO this member is apart of
  dao: DAOEntity | undefined;
}

type Props = RequiredProps & InferredProps;

class DAOMember extends Component<Props, Entity, Data> {
  protected createEntity(): Entity {
    const { dao, address } = this.props;

    // TODO: better error handling? maybe have another abstract function
    // that's a predicate that lets you know if entity can be created w/
    // provided data & gives user friendly sanitization errors?
    if (!dao) {
      throw Error(
        "DAO Missing: Please provide this field as a prop, or use the inference component."
      );
    }
    return new Entity(dao.context, address);
  }

  public static get Entity() {
    return CreateContextFeed(
      this._EntityContext.Consumer,
      this._LogsContext.Consumer
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this._DataContext.Consumer,
      this._LogsContext.Consumer
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer
    );
  }

  protected static _EntityContext = React.createContext({});
  protected static _DataContext = React.createContext({});
  protected static _LogsContext = React.createContext({});
}

class Member extends React.Component<RequiredProps> {
  public render() {
    const { address, children } = this.props;

    return (
      <DAO.Entity>
        {(entity: DAOEntity) => (
          <DAOMember address={address} dao={entity}>
            {children}
          </DAOMember>
        )}
      </DAO.Entity>
    );
  }

  public static get Entity() {
    return DAOMember.Entity;
  }

  public static get Data() {
    return DAOMember.Data;
  }

  public static get Logs() {
    return DAOMember.Logs;
  }
}

export default Member;

export {
  DAOMember,
  Member,
  Props as MemberProps,
  Entity as MemberEntity,
  Data as MemberData,
  ComponentLogs,
};
