import * as React from "react";
import { Context } from "react";
import { PlatformConfig } from "./configs/PlatformConfig";

interface Props {
  config: PlatformConfig;
}

export class Platform extends React.Component<Props>
{
  public static get Config() {
    return Platform.ConfigContext().Consumer;
  }

  private static ConfigContext(): Context<PlatformConfig> {
    return Platform._ConfigContext as any;
  }

  private static _ConfigContext = React.createContext({ });

  render() {
    const ConfigProvider = Platform.ConfigContext().Provider;

    const { config, children } = this.props;

    return (
      <ConfigProvider value={config}>
        {children}
      </ConfigProvider>
    )
  }
}
