import * as React from "react";
import { Protocol } from "../runtime";
import { ArcConfig } from "./ArcConfig";
import { CreateContextFeed } from "../runtime/ContextFeed";

export class Arc extends Protocol<ArcConfig> {
  protected async initialize() {
    // try {
    await this.props.config.initialize();
    /* } catch (e) {
      throw new Error("Config prop is undefined");
    } */
  }

  public static get Config() {
    return CreateContextFeed(
      this._ConfigContext.Consumer,
      this._LogsContext.Consumer
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer
    );
  }

  protected static _ConfigContext = React.createContext({});
  protected static _LogsContext = React.createContext({});
}
