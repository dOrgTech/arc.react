import * as React from "react";
import { DAO as Entity, IDAOState as Data } from "@daostack/client";
import { Arc, ArcConfig, Component, ComponentLogs } from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";

interface RequiredProps {
  // Address of the DAO Avatar
  address: string;
}

interface InferredProps {
  // Arc Instance
  arcConfig: ArcConfig | undefined;
}

type Props = RequiredProps & InferredProps;

class ArcDAO extends Component<Props, Entity, Data> {
  protected createEntity(): Entity {
    const { arcConfig, address } = this.props;
    if (!arcConfig) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }
    return new Entity(address, arcConfig.connection);
  }

  protected async initialize(entity: Entity | undefined): Promise<void> {
    if (entity) {
      await entity.fetchStaticState();
    }

    return Promise.resolve();
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
      <Arc.Config>
        {(arc: ArcConfig) => (
          <ArcDAO address={address} arcConfig={arc}>
            {children}
          </ArcDAO>
        )}
      </Arc.Config>
    );
  }

  public static get Entity() {
    return ArcDAO.Entity;
  }

  public static get Data() {
    return ArcDAO.Data;
  }

  public static get Logs() {
    return ArcDAO.Logs;
  }
}

export default DAO;

export { ArcDAO, DAO, Props as DAOProps, Entity as DAOEntity, Data as DAOData };
