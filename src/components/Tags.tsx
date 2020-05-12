import * as React from "react";
import { Observable } from "rxjs";
import { ITagQueryOptions as FilterOptions } from "@dorgtech/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  InferredTag as Component,
  TagEntity as Entity,
  TagData as Data,
  CProps,
  ComponentList,
  ComponentListLogs,
  ComponentListProps,
} from "../";
import { CreateContextFeed } from "../runtime/ContextFeed";

type RequiredProps = ComponentListProps<Entity, FilterOptions>;

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredTags extends ComponentList<InferredProps, Component> {
  createObservableEntities(): Observable<Entity[]> {
    const { config, filter } = this.props;
    if (!config) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }
    return Entity.search(config.connection, filter);
  }

  renderComponent(
    entity: Entity,
    children: any,
    index: number
  ): React.ComponentElement<CProps<Component>, any> {
    const { config } = this.props;

    return (
      <Component
        key={`${entity.id}_${index}`}
        id={entity.id}
        config={config}
        entity={entity}
      >
        {children}
      </Component>
    );
  }

  public static get Entities() {
    return CreateContextFeed(
      this._EntitiesContext.Consumer,
      this._LogsContext.Consumer,
      "Tags"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "Tags"
    );
  }

  protected static _EntitiesContext = React.createContext<Entity[] | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<
    ComponentListLogs | undefined
  >(undefined);
}

class Tags extends React.Component<RequiredProps> {
  render() {
    const { children, sort, filter } = this.props;

    return (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredTags config={config} sort={sort} filter={filter}>
            {children}
          </InferredTags>
        )}
      </Protocol.Config>
    );
  }

  public static get Entities() {
    return InferredTags.Entities;
  }

  public static get Logs() {
    return InferredTags.Logs;
  }
}

export { Tags, InferredTags };
