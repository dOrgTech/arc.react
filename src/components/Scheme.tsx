import * as React from "react";
import {
  Component,
  ComponentLogs,
  BaseProps
} from "../runtime";
import {
  CreateContextFeed
} from "../runtime/ContextFeed";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig
} from "../protocol";
import {
  Scheme as Entity,
  ISchemeState as Data
} from "@daostack/client";

// TODO
type Code = { }

interface RequiredProps extends BaseProps {
  // Scheme ID
  id: string;
}

interface InferredProps {
  // Arc Instance
  arcConfig: ProtocolConfig | undefined;
}

type Props = RequiredProps & InferredProps;

class ArcScheme extends Component<Props, Entity, Data, Code>
{
  protected createEntity(): Entity {
    const { arcConfig, id } = this.props;

    if (!arcConfig) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }

    return new Entity(id, arcConfig.connection);
  }

  protected async initialize(entity: Entity | undefined): Promise<void> {
    if (entity) {
      await entity.fetchStaticState();
    }

    return Promise.resolve();
  }

  public static get Entity() {
    return CreateContextFeed(this._EntityContext.Consumer, this._LogsContext.Consumer);
  }

  public static get Data() {
    return CreateContextFeed(this._DataContext.Consumer, this._LogsContext.Consumer);
  }

  public static get Code() {
    return CreateContextFeed(this._CodeContext.Consumer, this._LogsContext.Consumer);
  }

  public static get Logs() {
    return CreateContextFeed(this._LogsContext.Consumer, this._LogsContext.Consumer);
  }

  protected static _EntityContext = React.createContext({ });
  protected static _DataContext   = React.createContext({ });
  protected static _CodeContext   = React.createContext({ });
  protected static _LogsContext   = React.createContext({ });
}

class Scheme extends React.Component<RequiredProps>
{
  public render() {
    const { id, children } = this.props;

    return (
      <Protocol.Config>
      {(arc: ProtocolConfig) => (
        <ArcScheme id={id} arcConfig={arc}>
        {children}
        </ArcScheme>
      )}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return ArcScheme.Entity;
  }

  public static get Data() {
    return ArcScheme.Data;
  }

  public static get Code() {
    return ArcScheme.Code;
  }

  public static get Logs() {
    return ArcScheme.Logs;
  }
}

export default Scheme;

export {
  ArcScheme,
  Scheme,
  Props  as SchemeProps,
  Entity as SchemeEntity,
  Data   as SchemeData,
  Code   as SchemeCode,
  ComponentLogs
};
