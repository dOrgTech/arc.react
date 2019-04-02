import * as React from "react";
import { Observable } from "rxjs";
import {
  CEntity,
  CProps,
  ComponentList,
  BaseProps
} from "../runtime";
import {
  Arc,
  ArcConfig
} from "../protocol";
import {
  ArcDAO
} from "./";

interface RequiredProps { }

interface InferredProps {
  // Arc Instance
  arcConfig: ArcConfig | undefined;
}

type Props = RequiredProps & InferredProps & BaseProps;

class ArcDAOs extends ComponentList<Props, ArcDAO>
{
  createObservableEntities(): Observable<CEntity<ArcDAO>[]> {
    const { arcConfig } = this.props;
    if (!arcConfig) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }
    return arcConfig.connection.daos();
  }

  renderComponent(entity: CEntity<ArcDAO>, children: any): React.ComponentElement<CProps<ArcDAO>, any> {
    const { arcConfig } = this.props;

    return (
      <ArcDAO address={entity.address} arcConfig={arcConfig}>
        {children}
      </ArcDAO>
    );
  }
}

class DAOs extends React.Component<RequiredProps>
{
  render() {
    const { children } = this.props;

    return (
      <Arc.Config>
      {arc =>
        <ArcDAOs arcConfig={arc}>
          {children}
        </ArcDAOs>
      }
      </Arc.Config>
    )
  }
}

export default DAOs;

export {
  ArcDAOs,
  DAOs
};
