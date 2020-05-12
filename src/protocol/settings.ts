import { RetryLink } from "apollo-link-retry";
import { IArcOptions } from "@dorgtech/arc.js";

export type Network = "private" | "kovan" | "rinkeby" | "mainnet" | "xdai";

interface SubgraphEndpoint {
  http: string;
  ws: string;
}

type SubgraphEndpoints = {
  [network in Network]: SubgraphEndpoint;
};

export type ArcSettings = IArcOptions;

type NetworkSettings = {
  // TODO: get this type from arc.js
  [network in Network]: ArcSettings;
};

const subgraphEndpoints: SubgraphEndpoints = {
  mainnet: {
    http: "https://api.thegraph.com/subgraphs-daostack/name/daostack/v39_3",
    ws: "wss://api.thegraph.com/subgraphs-daostack/name/daostack/v39_3",
  },
  rinkeby: {
    http:
      "https://api.thegraph.com/subgraphs-daostack/name/daostack/v39_3_rinkeby",
    ws: "wss://api.thegraph.com/subgraphs-daostack/name/daostack/v39_3_rinkeby",
  },
  kovan: {
    http:
      "https://api.thegraph.com/subgraphs-daostack/name/daostack/v39_3_kovan",
    ws: "wss://api.thegraph.com/subgraphs-daostack/name/daostack/v39_3_kovan",
  },
  xdai: {
    http:
      "https://api.thegraph.com/subgraphs-daostack/name/daostack/v39_3_xdai",
    ws: "wss://api.thegraph.com/subgraphs-daostack/name/daostack/v39_3_xdai",
  },
  private: {
    http: "http://127.0.0.1:8000/subgraphs/name/daostack",
    ws: "ws://127.0.0.1:8001/subgraphs/name/daostack",
  },
};

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

export const networkSettings: NetworkSettings = {
  private: {
    graphqlHttpProvider: subgraphEndpoints.private.http,
    graphqlWsProvider: subgraphEndpoints.private.ws,
    web3Provider: "ws://127.0.0.1:8545",
    ipfsProvider: "http://127.0.0.1:5001/api/v0",
    retryLink,
  },
  rinkeby: {
    graphqlHttpProvider: subgraphEndpoints.rinkeby.http,
    graphqlWsProvider: subgraphEndpoints.rinkeby.ws,
    web3Provider: `wss://rinkeby.infura.io/ws/v3/${process.env.INFURA_ID}`,
    ipfsProvider: "https://api.thegraph.com:443/ipfs-daostack/api/v0",
    retryLink,
  },
  kovan: {
    graphqlHttpProvider: subgraphEndpoints.kovan.http,
    graphqlWsProvider: subgraphEndpoints.kovan.ws,
    web3Provider: `wss://kovan.infura.io/ws/v3/${process.env.INFURA_ID}`,
    ipfsProvider: "https://api.thegraph.com:443/ipfs-daostack/api/v0",
    retryLink,
  },
  xdai: {
    graphqlHttpProvider: subgraphEndpoints.xdai.http,
    graphqlWsProvider: subgraphEndpoints.xdai.ws,
    web3Provider:
      "https://poa.api.nodesmith.io/v1/dai/jsonrpc?apiKey=128059b9320a462699aef283a7ae2546",
    ipfsProvider: "https://api.thegraph.com:443/ipfs-daostack/api/v0",
    retryLink,
  },
  mainnet: {
    graphqlHttpProvider: subgraphEndpoints.mainnet.http,
    graphqlWsProvider: subgraphEndpoints.mainnet.ws,
    web3Provider: `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_ID}`,
    ipfsProvider: "https://api.thegraph.com:443/ipfs-daostack/api/v0",
    retryLink,
  },
};
