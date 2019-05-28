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
  ArcReward,
  RewardEntity
} from "./";

const { first } = require('rxjs/operators')

// TODO: remove once change is merged
import gql from "graphql-tag";

interface RequiredProps extends BaseProps { }

interface InferredProps {
  // Arc Instance
  arcConfig: ArcConfig | undefined;
}

type Props = RequiredProps & InferredProps;

class ArcRewards extends ComponentList<Props, ArcReward>
{
  async fetchData(entity: RewardEntity): Promise<any>{
    return entity.state().pipe(first()).toPromise();
  }

  createObservableEntities(): Observable<RewardEntity[]> {
    const { arcConfig } = this.props;

    if (!arcConfig) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }

    // TODO: uncomment when this issue is resolved
    // https://github.com/daostack/client/issues/213
    // return RewardEntity.search({}, arcConfig.connection);

    // TODO: remove this when ...search(...) is uncommented above
    const arc = arcConfig.connection;
    const query = gql`
      {
        gprewards {
          id
        }
      }
    `;
    return arc.getObservableList(
      query,
      (r: any) => new RewardEntity(r.id, arc)
    ) as Observable<RewardEntity[]>;
  }

  renderComponent(entity: RewardEntity, children: any): React.ComponentElement<CProps<ArcReward>, any> {
    const { arcConfig } = this.props;

    return (
      <ArcReward id={entity.id} arcConfig={arcConfig}>
      {children}
      </ArcReward>
    );
  }
}

class Rewards extends React.Component<RequiredProps>
{
  render() {
    const { children } = this.props;

    return (
      <Arc.Config>
      {(arc: ArcConfig) =>
        <ArcRewards arcConfig={arc}>
        {children}
        </ArcRewards>
      }
      </Arc.Config>
    )
  }
}

export default Rewards;

export {
  ArcRewards,
  Rewards
};
