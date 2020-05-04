import * as React from "react";
import { DAO as Entity, IDAOState as Data } from "@dorgtech/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  Component,
  ComponentLogs,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";

interface RequiredProps {
  // Address of the DAO Avatar
  address: string;
  noSub?: boolean;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredDAO extends Component<InferredProps, Entity, Data> {
  protected createEntity(): Entity {
    const { config, address } = this.props;
    if (!config) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }
    return new Entity(config.connection, address);
  }

  public static get Entity() {
    return CreateContextFeed(
      this._EntityContext.Consumer,
      this._LogsContext.Consumer,
      "DAO"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this._DataContext.Consumer,
      this._LogsContext.Consumer,
      "DAO"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "DAO"
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

class DAO extends React.Component<RequiredProps> {
  public render() {
    const { address, children } = this.props;

    return (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredDAO address={address} config={config}>
            {children}
          </InferredDAO>
        )}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return InferredDAO.Entity;
  }

  public static get Data() {
    return InferredDAO.Data;
  }

  public static get Logs() {
    return InferredDAO.Logs;
  }
}

export default DAO;

export { DAO, InferredDAO, Entity as DAOEntity, Data as DAOData };
