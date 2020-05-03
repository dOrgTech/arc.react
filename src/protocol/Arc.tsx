import * as React from "react";
import { Protocol } from "../runtime";
import { ArcConfig } from "./ArcConfig";
import { CreateContextFeed } from "../runtime/ContextFeed";

export class Arc extends Protocol<ArcConfig> {
  protected async initialize() {
    try {
      await this.props.config.initialize();
    } catch (e) {
      throw Error(e);
    }
  }

  public static get Config() {
    return CreateContextFeed(
      this._ConfigContext.Consumer,
      this._LogsContext.Consumer,
      "Arc"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "Arc"
    );
  }

  protected static _ConfigContext = React.createContext<{} | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<{} | undefined>(
    undefined
  );
}
