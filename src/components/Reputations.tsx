import * as React from "react";
import { Observable } from "rxjs";
import {
  CProps,
  ComponentList,
  BaseProps
} from "../runtime";
import {
  Arc,
  ArcConfig
} from "../protocol";
import {
  ArcReputation,
  ReputationData,
  ReputationEntity,
} from "./";

interface RequiredProps extends BaseProps { }

interface InferredProps {
  // Arc Instance
  arcConfig: ArcConfig | undefined;
}

type Props = RequiredProps & InferredProps;

class ArcReputations extends ComponentList<Props, ArcReputation>
{
  createObservableEntities(): Observable<ReputationEntity[]> {
    const { arcConfig } = this.props;
    if (!arcConfig) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }
    return ReputationEntity.search({}, arcConfig.connection);
  }

  fetchData(entity: ReputationEntity): Promise<any>{
    return new Promise((resolve, reject) => {
      const state = entity.state()
      state.subscribe(
        (data: ReputationData) => resolve(data),
        (error: Error) => reject(error))
    })
  }

  renderComponent(entity: ReputationEntity, children: any): React.ComponentElement<CProps<ArcReputation>, any> {
    const { arcConfig } = this.props;

    return (
      <ArcReputation address={entity.address} arcConfig={arcConfig}>
      {children}
      </ArcReputation>
    );
  }
}

class Reputations extends React.Component<RequiredProps>
{
  render() {
    const { children } = this.props;

    return (
      <Arc.Config>
      {(arc: ArcConfig) =>
        <ArcReputations arcConfig={arc}>
        {children}
        </ArcReputations>
      }
      </Arc.Config>
    )
  }
}

export default Reputations;

export {
  ArcReputations,
  Reputations
};
