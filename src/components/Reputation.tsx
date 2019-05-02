import * as React from "react";
import {
  Component,
  ComponentLogs,
  BaseProps,
} from "../runtime";
import {
  CreateContextFeed
} from "../runtime/ContextFeed";
import {
  Arc,
  ArcConfig
} from "../protocol";
import {
  Reputation as Entity,
  IReputationState as Data
} from "@daostack/client";
import {
  DAO,
  DAOData
} from "./DAO";

type Code = { }

const entityConsumer = Component.EntityContext<Entity>().Consumer;
const dataConsumer   = Component.DataContext<Data>().Consumer;
const codeConsumer   = Component.CodeContext<Code>().Consumer;
const logsConsumer   = Component.LogsContext().Consumer;

interface RequiredProps {
  // Address of the Reputation Token
  address?: string;
}

interface InferredProps {
  // Arc Instance
  arcConfig: ArcConfig | undefined;
}

type Props = RequiredProps & InferredProps & BaseProps;

class ArcReputation extends Component<Props, Entity, Data, Code>
{
  createEntity(): Entity {
    const { arcConfig, address } = this.props;
    if (!arcConfig) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }
    if (!address) {
      throw Error("Address Missing: Please provide this field as a prop, or use the inference component.")
    }
    return new Entity(address, arcConfig.connection);
  }

  public static get Entity() {
    return CreateContextFeed(entityConsumer);
  }

  public static get Data() {
    return CreateContextFeed(dataConsumer);
  }

  public static get Code() {
    return CreateContextFeed(codeConsumer);
  }

  public static get Logs() {
    return CreateContextFeed(logsConsumer);
  }
}

class Reputation extends React.Component<RequiredProps>
{
  render() {
    const { address, children } = this.props;

    if (address !== undefined) {
      return (
        <Arc.Config>
        {(arc: ArcConfig) => (
          <ArcReputation address={address} arcConfig={arc}>
          {children}
          </ArcReputation>
        )}
        </Arc.Config>
      )
    } else {
      return (
        <Arc.Config>
        <DAO.Data>
        {(arc: ArcConfig, daoData: DAOData) => {
          console.log("HERE");
          console.log(typeof arc);
          console.log(Object.keys(arc))
          console.log(typeof daoData);
          console.log("after");
          console.log(Object.keys(daoData))
          console.log(typeof daoData.reputation.address);
          return (
            <ArcReputation address={daoData.reputation.address} arcConfig={arc}>
            {children}
            </ArcReputation>
          );
        }}
        </DAO.Data>
        </Arc.Config>
      )
    }
  }

  public static get Entity() {
    return CreateContextFeed(entityConsumer);
  }

  public static get Data() {
    return CreateContextFeed(dataConsumer);
  }

  public static get Code() {
    return CreateContextFeed(codeConsumer);
  }

  public static get Logs() {
    return CreateContextFeed(logsConsumer);
  }
}

export default Reputation;

export {
  ArcReputation,
  Reputation,
  Props as ReputationProps,
  Entity as ReputationEntity,
  Data as ReputationData,
  Code as ReputationCode,
  ComponentLogs
};
