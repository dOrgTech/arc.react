import { Arc as Connection } from "@dorgtech/arc.js";
import { ProtocolConfig } from "../runtime";
import { Network, networkSettings, Settings } from "./";

export class ArcConfig extends ProtocolConfig<Connection> {
  public isInitialized: boolean;
  public connection: Connection;

  constructor(networkOrSettings: Network | Settings) {
    super();

    if (typeof networkOrSettings === "string") {
      this.connection = new Connection(networkSettings[networkOrSettings]);
    } else {
      this.connection = new Connection(networkOrSettings);
    }

    this.isInitialized = false;
  }

  public async initialize(): Promise<boolean> {
    if (await this.connection.fetchContractInfos()) this.isInitialized = true;
    return this.isInitialized;
  }
}
