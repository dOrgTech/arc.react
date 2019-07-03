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

interface RequiredProps extends BaseProps {
  // Address of the Reputation Token
  address?: string;
}

interface InferredProps {
  // Arc Instance
  arcConfig: ArcConfig | undefined;
}

type Props = RequiredProps & InferredProps;

class ArcReputation extends Component<Props, Entity, Data, Code>
{
  protected createEntity(): Entity {
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
    return CreateContextFeed(this._EntityContext.Consumer);
  }

  public static get Data() {
    return CreateContextFeed(this._DataContext.Consumer);
  }

  public static get Code() {
    return CreateContextFeed(this._CodeContext.Consumer);
  }

  public static get Logs() {
    return CreateContextFeed(this._LogsContext.Consumer);
  }

  protected static _EntityContext = React.createContext({ });
  protected static _DataContext   = React.createContext({ });
  protected static _CodeContext   = React.createContext({ });
  protected static _LogsContext   = React.createContext({ });
}

class Reputation extends React.Component<RequiredProps>
{
  public render() {
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
      );
    } else {
      return (
        <Arc.Config>
        <DAO.Data>
        {(arc: ArcConfig, dao: DAOData) => (
          <ArcReputation address={dao.reputation.address} arcConfig={arc}>
          {children}
          </ArcReputation>
        )}
        </DAO.Data>
        </Arc.Config>
      );
    }
  }

  public static get Entity() {
    return ArcReputation.Entity;
  }

  public static get Data() {
    return ArcReputation.Data;
  }

  public static get Code() {
    return ArcReputation.Code;
  }

  public static get Logs() {
    return ArcReputation.Logs;
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
