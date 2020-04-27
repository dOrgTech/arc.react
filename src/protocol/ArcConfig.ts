import { ProtocolConfig, Network } from "../runtime/ProtocolConfig";

export class ArcConfig extends ProtocolConfig {
  public isInitialized: boolean;

  constructor(network: Network) {
    super();
    this.isInitialized = false;
    this._getConnectionParams(network);
  }

  public async initialize(): Promise<boolean> {
    if (await this.connection.fetchContractInfos()) this.isInitialized = true;
    return this.isInitialized;
  }
}

export const getConfig = (network: Network): ArcConfig => {
  return new ArcConfig(network);
};
