import { ProtocolConfig } from "../runtime/ProtocolConfig";
import { Arc as Connection } from "@daostack/client";

export class ArcConfig extends ProtocolConfig
{
  public connection: Connection;

  constructor(
    public web3HttpUrl: string,
    public graphqlHttpUrl: string,
    public graphqlWsUrl: string
  ) {
    super();
    this.connection = new Connection({
      graphqlHttpProvider: graphqlHttpUrl,
      graphqlWsProvider: graphqlWsUrl,
      web3Provider: web3HttpUrl
    });
  }
}

// TODO: export different predefined configs for:
// - local hosts
// - test networks
// - main-net
export const DefaultArcConfig = new ArcConfig(
  "http://127.0.0.1:8545",
  "http://127.0.0.1:8000/subgraphs/name/daostack",
  "ws://127.0.0.1:8001/subgraphs/name/daostack"
);
