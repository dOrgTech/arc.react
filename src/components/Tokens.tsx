import * as React from "react";
import { Observable } from "rxjs";
import { CProps, ComponentList, ComponentListProps } from "../runtime";
import { Arc as Protocol, ArcConfig as ProtocolConfig } from "../protocol";
import {
  ArcToken as Component,
  TokenEntity as Entity,
  TokenData as Data,
} from "./";
import { ITokenQueryOptions as FilterOptions } from "@dorgtech/arc.js";

type RequiredProps = ComponentListProps<Entity, Data, FilterOptions>;

interface InferredProps {
  arcConfig: ProtocolConfig | undefined;
}

type Props = RequiredProps & InferredProps;

class ArcTokens extends ComponentList<Props, Component> {
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
      <Component key={entity.id} address={entity.address} arcConfig={arcConfig}>
        {children}
      </Component>
    );
  }
}

class Tokens extends React.Component<RequiredProps> {
  render() {
    const { children, sort, filter } = this.props;

    return (
      <Protocol.Config>
        {(arc: ProtocolConfig) => (
          <ArcTokens arcConfig={arc} sort={sort} filter={filter}>
            {children}
          </ArcTokens>
        )}
      </Protocol.Config>
    );
  }
}

export default Tokens;

export { ArcTokens, Tokens };
