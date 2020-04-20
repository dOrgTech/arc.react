import * as React from "react";
import { Observable } from "rxjs";
import { CProps, ComponentList, ComponentListProps } from "../runtime";
import { Arc as Protocol, ArcConfig as ProtocolConfig } from "../protocol";
import { ArcDAO as Component, DAOEntity as Entity, DAOData as Data } from "./";
import { IDAOQueryOptions as FilterOptions } from "@daostack/client";

type RequiredProps = ComponentListProps<Entity, Data, FilterOptions>;

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
}

export default DAOs;

export { ArcDAOs, DAOs };
