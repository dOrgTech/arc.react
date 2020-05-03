import * as React from "react";
import { ArcConfig } from "./";
import { Protocol, ProtocolLogs } from "../runtime";
import { CreateContextFeed } from "../runtime/ContextFeed";

export class Arc extends Protocol<ArcConfig> {
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

  protected static _ConfigContext = React.createContext<ArcConfig | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<ProtocolLogs | undefined>(
    undefined
  );
}
