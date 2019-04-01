import * as React from "react";
import { Context } from "react";
import { ProtocolConfig } from "./configs/ProtocolConfig";
export { ProtocolConfig };

interface Props<Config extends ProtocolConfig> {
  config: Config
}

// TODO: this & Platform.tsx are pratically the same thing, abstract?
export abstract class Protocol<
  Config extends ProtocolConfig
> extends React.Component<Props<Config>>
{
  public static get Config() {
    return Protocol._ConfigContext.Consumer;
  }

  private static ConfigContext<Config extends ProtocolConfig>(): Context<Config> {
    return Protocol._ConfigContext as any;
  }

  private static _ConfigContext = React.createContext(undefined);

  render() {
    const ConfigProvider = Protocol.ConfigContext<Config>().Provider;

    const { config, children } = this.props;

    return (
      <ConfigProvider value={config}>
        {children}
      </ConfigProvider>
    )
  }
}
