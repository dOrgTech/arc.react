import { ProtocolConfig } from "../runtime/ProtocolConfig";
import { Arc as Connection} from "@daostack/client";

const deployedContractAddresses = require("@daostack/migration/migration.json");

export class ArcConfig extends ProtocolConfig
{
  public connection: Connection;

  constructor(
    public web3HttpUrl: string,
    public graphqlHttpUrl: string,
    public graphqlWsUrl: string,
    public ipfsProvider: any,
    public network: string
  ) {
    super();
    this.connection = new Connection({
      graphqlHttpProvider: graphqlHttpUrl,
      graphqlWsProvider: graphqlWsUrl,
      web3Provider: web3HttpUrl,
      ipfsProvider: ipfsProvider,
      contractAddresses: {
        ...deployedContractAddresses[network]
      }.base
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
  "ws://127.0.0.1:8001/subgraphs/name/daostack",
  "localhost",
  "private"
);

export const HostedArcConfig = new ArcConfig(
  "wss://mainnet.infura.io/ws/v3/e0cdf3bfda9b468fa908aa6ab03d5ba2",
  "https://subgraph.daostack.io/subgraphs/name/v16-without-uc",
  "wss://ws.subgraph.daostack.io/subgraphs/name/v16-without-uc",
  {
      "host": "subgraph.daostack.io",
      "port": "443",
      "protocol": "https",
      "api-path": "/ipfs/api/v0/"
  },
  "mainnet"
);
