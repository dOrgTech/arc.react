import * as React from "react";
import { ProtocolConfig } from "./ProtocolConfig";

type PCConnection<Protocol> = Protocol extends ProtocolConfig<infer Connection>
  ? Connection
  : never;

interface Props<Config extends ProtocolConfig<PCConnection<Config>>> {
  config: Config;
}

export abstract class Protocol<
  Config extends ProtocolConfig<PCConnection<Config>>
> extends React.Component<Props<Config>> {
  // Complete any asynchronous initialization work needed by the ProtocolConfig
  protected async initialize() {
    await this.props.config.initialize();
  }

  protected static _ConfigContext: React.Context<{}>;

  // This trick allows us to access the static objects
  // defined in the derived class. See this code sample:
  // https://github.com/Microsoft/TypeScript/issues/5989#issuecomment-163066313
  // @ts-ignore: This should always be true
  "constructor": typeof Protocol;

  public render() {
    const ConfigProvider = this.constructor._ConfigContext.Provider as any;

    const { config, children } = this.props;

    return (
      <ConfigProvider value={config.isInitialized ? config : undefined}>
        {children}
      </ConfigProvider>
    );
  }

  public async componentDidMount() {
    await this.initialize();
    this.forceUpdate();
  }
}
