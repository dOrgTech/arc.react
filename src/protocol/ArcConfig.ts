import { ProtocolConfig } from "../runtime/ProtocolConfig";
import { Arc as Connection} from "@daostack/client";

export class ArcConfig extends ProtocolConfig
{
  public isInitialized: boolean;
  public connection: Connection;

  constructor(
    public web3HttpUrl: string,
    public graphqlHttpUrl: string,
    public graphqlWsUrl: string,
    public ipfsProvider: any,
    public network: "private" | "kovan" | "rinkeby" | "mainnet"
  ) {
    super();
    this.isInitialized = false;
    this.connection = new Connection({
      graphqlHttpProvider: graphqlHttpUrl,
      graphqlWsProvider: graphqlWsUrl,
      web3Provider: web3HttpUrl,
      ipfsProvider: ipfsProvider
    });
  }

  public async initialize(): Promise<boolean> {
    this.isInitialized = await this.connection.initialize();
    return this.isInitialized;
  }
}

export const DevArcConfig = new ArcConfig(
  "ws://127.0.0.1:8545",
  "http://127.0.0.1:8000/subgraphs/name/daostack",
  "ws://127.0.0.1:8001/subgraphs/name/daostack",
  "localhost",
  "private"
);

export const TestArcConfig = new ArcConfig(
  "wss://rinkeby.infura.io/ws/v3/e0cdf3bfda9b468fa908aa6ab03d5ba2",
  "https://rinkeby.subgraph.daostack.io/subgraphs/name/v23",
  "wss://ws.rinkeby.subgraph.daostack.io/subgraphs/name/v23",
  {
    "host": "rinkeby.subgraph.daostack.io",
    "port": "443",
    "protocol": "https",
    "api-path": "/ipfs/api/v0/"
  },
  "rinkeby"
);

export const ProdArcConfig = new ArcConfig(
  "wss://mainnet.infura.io/ws/v3/e0cdf3bfda9b468fa908aa6ab03d5ba2",
  "https://subgraph.daostack.io/subgraphs/name/v23",
  "wss://ws.subgraph.daostack.io/subgraphs/name/v23",
  {
      "host": "subgraph.daostack.io",
      "port": "443",
      "protocol": "https",
      "api-path": "/ipfs/api/v0/"
  },
  "mainnet"
);
