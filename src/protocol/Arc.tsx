import * as React from "react";
import { Protocol } from "../runtime/Protocol";
import { ArcConfig } from "./ArcConfig";
import { CreateContextFeed } from "../runtime/ContextFeed";

export class Arc extends Protocol<ArcConfig> {

  public static get Config() {
    return CreateContextFeed(this._ConfigContext.Consumer, undefined);
  }

  protected static _ConfigContext = React.createContext({ });

  protected async initialize() {
    await this.props.config.initialize();
  }
}
