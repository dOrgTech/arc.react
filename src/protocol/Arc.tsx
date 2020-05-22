import * as React from "react";
import { ArcConfig } from "./";
import { Protocol, ProtocolLogs } from "../runtime";
import { CreateContextFeed } from "../runtime/ContextFeed";

export class Arc extends Protocol<ArcConfig> {
  public static get Config() {
    return CreateContextFeed(
      this.ConfigContext.Consumer,
      this.LogsContext.Consumer,
      "Arc"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this.LogsContext.Consumer,
      this.LogsContext.Consumer,
      "Arc"
    );
  }

  protected static ConfigContext = React.createContext<ArcConfig | undefined>(
    undefined
  );
  protected static LogsContext = React.createContext<ProtocolLogs | undefined>(
    undefined
  );
}
