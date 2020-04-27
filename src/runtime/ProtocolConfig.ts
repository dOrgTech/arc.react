import { Arc as Connection } from "@daostack/client";
import { settings } from "../protocol/settings";

export type Network = "private" | "kovan" | "rinkeby" | "mainnet";

export abstract class ProtocolConfig {
  public abstract isInitialized: boolean;
  protected connection!: Connection;
  protected _getConnectionParams(network: Network) {
    this.connection = new Connection(settings[network]);
  }
}
