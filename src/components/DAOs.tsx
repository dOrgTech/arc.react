import * as React from "react";
import { Observable } from "rxjs";
import { IDAOQueryOptions as FilterOptions } from "@daostack/client";
import { CProps, ComponentList, ComponentListProps } from "../runtime";
import { Arc as Protocol, ArcConfig as ProtocolConfig } from "../protocol";
import { ArcDAO as Component, DAOEntity as Entity, DAOData as Data } from "./";
import { CreateContextFeed } from "../runtime/ContextFeed";

interface RequiredProps
  extends ComponentListProps<Entity, Data, FilterOptions> {}

interface InferredProps {
  arcConfig: ProtocolConfig | undefined;
}

type Props = RequiredProps & InferredProps;

class ArcDAOs extends ComponentList<Props, Component> {
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

    return (
      <Component address={entity.id} arcConfig={arcConfig}>
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

class DAOs extends React.Component<RequiredProps> {
  render() {
    const { children, sort, filter } = this.props;

    return (
      <Protocol.Config>
        {(arcConfig: ProtocolConfig) => (
          <ArcDAOs arcConfig={arcConfig} sort={sort} filter={filter}>
            {children}
          </ArcDAOs>
        )}
      </Protocol.Config>
    );
  }

  public static get Entities() {
    return ArcDAOs.Entities;
  }

  public static get Logs() {
    return ArcDAOs.Logs;
  }
}

export default DAOs;

export { ArcDAOs, DAOs };
