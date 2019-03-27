import { ProtocolConfig } from "../runtime/configs/ProtocolConfig";
import { Arc as Connection } from "@daostack/client";

export class ArcConfig extends ProtocolConfig
{
  public connection: Connection;

  constructor(
    public web3HttpUrl: string,
    public graphqlHttpUrl: string,
    public graphqlWsUrl: string
  ) {
    super(web3HttpUrl, graphqlHttpUrl, graphqlWsUrl);

    this.connection = new Connection({
      graphqlHttpProvider: graphqlHttpUrl,
      graphqlWsProvider: graphqlWsUrl,
      web3Provider: web3HttpUrl
    });
  }
}

export const DefaultArcConfig = new ArcConfig(
  "http://127.0.0.1:8545",
  "http://127.0.0.1:8000/subgraphs/name/daostack",
  "ws://127.0.0.1:8001/subgraphs/name/daostack"
);
