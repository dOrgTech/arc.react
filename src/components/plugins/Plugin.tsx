import * as React from "react";
import { Plugin as Entity, IPluginState as EntityData } from "@dorgtech/arc.js";
import { PluginManager } from "./SchemeRegistrar/Plugin";
interface RequiredProps {
  // Plugin ID
  id: string;
  type?: string;
}

class Plugin extends React.Component<RequiredProps> {
  public render() {
    const { id, children, type } = this.props;

    if (!type) {
      throw Error("You need to specify a type when using Plugin component");
    }

    switch (type) {
      case "SchemeRegistrar":
        return <PluginManager id={id}>{children}</PluginManager>;
      // case "ReputationFromToken":
      //   return <PluginReputationFromToken id={id}>{children}</PluginReputationFromToken>;
    }
  }
}

export default Plugin;

export { Plugin, Entity as PluginEntity, EntityData as PluginData };
