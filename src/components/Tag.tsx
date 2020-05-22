import * as React from "react";
import { Tag as Entity, ITagState as Data } from "@daostack/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  Component,
  ComponentLogs,
  ComponentProps,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";

interface RequiredProps extends ComponentProps<Entity, Data> {
  // Address of the Tag Avatar
  id: string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredTag extends Component<InferredProps, Entity, Data> {
  protected createEntity(): Entity {
    const { config, id } = this.props;
    if (!config) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }

    return new Entity(config.connection, id);
  }

  public static get Entity() {
    return CreateContextFeed(
      this.EntityContext.Consumer,
      this.LogsContext.Consumer,
      "Tag"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this.DataContext.Consumer,
      this.LogsContext.Consumer,
      "Tag"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this.LogsContext.Consumer,
      this.LogsContext.Consumer,
      "Tag"
    );
  }

  public static EntityContext = React.createContext<Entity | undefined>(
    undefined
  );
  public static DataContext = React.createContext<Data | undefined>(undefined);
  public static LogsContext = React.createContext<ComponentLogs | undefined>(
    undefined
  );
}

class Tag extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;

    return (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredTag id={id} config={config}>
            {children}
          </InferredTag>
        )}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return InferredTag.Entity;
  }

  public static get Data() {
    return InferredTag.Data;
  }

  public static get Logs() {
    return InferredTag.Logs;
  }
}

export default Tag;

export { Tag, InferredTag, Entity as TagEntity, Data as TagData };
