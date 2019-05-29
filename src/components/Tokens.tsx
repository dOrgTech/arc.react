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
  ArcToken,
  TokenData,
  TokenEntity
} from "./";

// TODO: remove once change is merged
import gql from "graphql-tag";

interface RequiredProps extends BaseProps { }

interface InferredProps {
  // Arc Instance
  arcConfig: ArcConfig | undefined;
}

type Props = RequiredProps & InferredProps;

class ArcTokens extends ComponentList<Props, ArcToken>
{
  fetchData(entity: TokenEntity): Promise<any> {
    return new Promise((resolve, reject) => {
      const state = entity.state()
      state.subscribe(
        (data: TokenData) => resolve(data),
        (error: Error) => reject(error))
    })
  }

  createObservableEntities(): Observable<TokenEntity[]> {
    const { arcConfig } = this.props;
    if (!arcConfig) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }
    // TODO: move all component lists to using the .search pattern + add filter options
    // TODO: uncomment when PR is merged in daostack/client repo
    // return TokenEntity.search({}, arcConfig.connection);

    // TODO: remove this when ...search(...) is uncommented above
    const arc = arcConfig.connection;
    const query = gql`
      {
        tokens {
          id
        }
      }
    `;
    return arc.getObservableList(
      query,
      (r: any) => new TokenEntity(r.id, arc)
    ) as Observable<TokenEntity[]>
  }

  renderComponent(entity: TokenEntity, children: any): React.ComponentElement<CProps<ArcToken>, any> {
    const { arcConfig } = this.props;

    return (
      <ArcToken address={entity.address} arcConfig={arcConfig}>
      {children}
      </ArcToken>
    );
  }
}

class Tokens extends React.Component<RequiredProps>
{
  render() {
    const { children } = this.props;

    return (
      <Arc.Config>
      {(arc: ArcConfig) =>
        <ArcTokens arcConfig={arc}>
        {children}
        </ArcTokens>
      }
      </Arc.Config>
    )
  }
}

export default Tokens;

export {
  ArcTokens,
  Tokens
};
