import * as React from "react";
import { Context } from "react";
import { ProtocolConfig } from "./configs/ProtocolConfig";

export interface Props {
  config: ProtocolConfig
}

// TODO: this & Platform.tsx are pratically the same thing, abstract?
export abstract class Protocol extends React.Component<Props>
{
  public static get Config() {
    return Protocol.ConfigContext().Consumer;
  }

  private static ConfigContext(): Context<ProtocolConfig> {
    return Protocol._ConfigContext as any;
  }

  private static _ConfigContext = React.createContext({ });

  render() {
    const ConfigProvider = Protocol.ConfigContext().Provider;

    const { config, children } = this.props;

    return (
      <ConfigProvider value={config}>
        {children}
      </ConfigProvider>
    )
  }
}
