import * as React from "react";
import { Context } from "react";
import { LoggingConfig } from "./configs/LoggingConfig";

interface Props {
  config: LoggingConfig;
}

export class Logging extends React.Component<Props>
{
  public static get Config() {
    return Logging.ConfigContext().Consumer;
  }

  private static ConfigContext(): Context<LoggingConfig> {
    return Logging._ConfigContext as any;
  }

  private static _ConfigContext = React.createContext({ });

  render() {
    const ConfigProvider = Logging.ConfigContext().Provider;

    const { config, children } = this.props;

    return (
      <ConfigProvider value={config}>
        {children}
      </ConfigProvider>
    )
  }
}
