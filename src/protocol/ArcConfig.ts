import { ProtocolConfig } from "../runtime/ProtocolConfig";
import { Arc as Connection } from "@daostack/client";
import { RetryLink } from "apollo-link-retry";

export class ArcConfig extends ProtocolConfig {
  public isInitialized: boolean;
  public connection: Connection;

  constructor(
    public web3HttpUrl: string,
    public graphqlHttpUrl: string,
    public graphqlWsUrl: string,
    public ipfsProvider: any,
    public network: "private" | "kovan" | "rinkeby" | "mainnet",
    public retryLink?: RetryLink
  ) {
    super();
    this.isInitialized = false;
    this.connection = new Connection({
      graphqlHttpProvider: graphqlHttpUrl,
      graphqlWsProvider: graphqlWsUrl,
      web3Provider: web3HttpUrl,
      ipfsProvider: ipfsProvider,
      graphqlRetryLink: retryLink,
    });
  }

  public async initialize(): Promise<boolean> {
    if (await this.connection.fetchContractInfos()) this.isInitialized = true;
    return this.isInitialized;
  }
}

const retryLink = new RetryLink({
  attempts: {
    max: 20,
    retryIf: (error, _operation) => {
      console.error("Error occurred fetching data, retrying...");
      return !!error;
    },
  },
  delay: {
    initial: 500,
    max: 2000,
  },
});

export const DevArcConfig = new ArcConfig(
  "ws://127.0.0.1:8545",
  "http://127.0.0.1:8000/subgraphs/name/daostack",
  "ws://127.0.0.1:8001/subgraphs/name/daostack",
  "localhost",
  "private",
  retryLink
);

export const TestArcConfig = new ArcConfig(
  "wss://rinkeby.infura.io/ws/v3/e0cdf3bfda9b468fa908aa6ab03d5ba2",
  "https://rinkeby.subgraph.daostack.io/subgraphs/name/v24",
  "wss://ws.rinkeby.subgraph.daostack.io/subgraphs/name/v24",
  {
    host: "rinkeby.subgraph.daostack.io",
    port: "443",
    protocol: "https",
    "api-path": "/ipfs/api/v0/",
  },
  "rinkeby",
  retryLink
);

export const ProdArcConfig = new ArcConfig(
  "wss://mainnet.infura.io/ws/v3/e0cdf3bfda9b468fa908aa6ab03d5ba2",
  "https://subgraph.daostack.io/subgraphs/name/v24",
  "wss://ws.subgraph.daostack.io/subgraphs/name/v24",
  {
    host: "subgraph.daostack.io",
    port: "443",
    protocol: "https",
    "api-path": "/ipfs/api/v0/",
  },
  "mainnet",
  retryLink
);
