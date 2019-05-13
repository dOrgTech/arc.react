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
  ReputationEntity
} from "./";

// TODO: remove once change is merged
import gql from "graphql-tag";

interface RequiredProps extends BaseProps { }

interface ArcInferredProps {
  // Arc Instance
  arcConfig: ArcConfig | undefined;
}

type ArcProps = RequiredProps & ArcInferredProps;

class ArcReputations extends ComponentList<ArcProps, ArcReputation>
{
  createObservableEntities(): Observable<ReputationEntity[]> {
    const { arcConfig } = this.props;
    if (!arcConfig) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }
    // TODO: move all component lists to using the .search pattern + add filter options
    // TODO: uncomment when PR is merged in daostack/client repo
    // return ReputationEntity.search({}, arcConfig.connection);

    // TODO: remove this when ...search(...) is uncommented above
    const arc = arcConfig.connection;
    const query = gql`
      {
        reps {
          id
        }
      }
    `;
    return arc.getObservableList(
      query,
      (r: any) => new ReputationEntity(r.id, arc)
    ) as Observable<ReputationEntity[]>
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
