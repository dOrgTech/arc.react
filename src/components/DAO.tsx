import * as React from "react";
import { DAO as Entity, IDAOState as Data } from "@dorgtech/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  Component,
  ComponentLogs,
  ComponentProps,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";

interface RequiredProps extends ComponentProps {
  // Address of the DAO Avatar
  address: string;
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
      this.EntityContext.Consumer,
      this.LogsContext.Consumer,
      "DAO"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this.DataContext.Consumer,
      this.LogsContext.Consumer,
      "DAO"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this.LogsContext.Consumer,
      this.LogsContext.Consumer,
      "DAO"
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

function useDAO(): [Data | undefined, Entity | undefined] {
  const data = React.useContext<Data | undefined>(InferredDAO.DataContext);
  const entity = React.useContext<Entity | undefined>(
    InferredDAO.EntityContext
  );
  return [data, entity];
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

export { DAO, InferredDAO, Entity as DAOEntity, Data as DAOData, useDAO };
