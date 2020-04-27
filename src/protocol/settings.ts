const SubgraphEndpoints = {
  http_main: "https://api.thegraph.com/subgraphs-daostack/name/daostack/v39_3",
  ws_main: "wss://api.thegraph.com/subgraphs-daostack/name/daostack/v39_3",
  http_rinkeby:
    "https://api.thegraph.com/subgraphs-daostack/name/daostack/v39_3_rinkeby",
  ws_rinkeby:
    "wss://api.thegraph.com/subgraphs-daostack/name/daostack/v39_3_rinkeby",
  http_kovan:
    "https://api.thegraph.com/subgraphs-daostack/name/daostack/v39_3_kovan",
  ws_kovan:
    "wss://api.thegraph.com/subgraphs-daostack/name/daostack/v39_3_kovan",
  http_xdai:
    "https://api.thegraph.com/subgraphs-daostack/name/daostack/v39_3_xdai",
  ws_xdai: "wss://api.thegraph.com/subgraphs-daostack/name/daostack/v39_3_xdai",
  http_ganache: "http://127.0.0.1:8000/subgraphs/name/daostack",
  ws_ganache: "ws://127.0.0.1:8001/subgraphs/name/daostack",
};

export const settings = {
  private: {
    graphqlHttpProvider: SubgraphEndpoints.http_ganache,
    graphqlWsProvider: SubgraphEndpoints.ws_ganache,
    web3Provider: "ws://127.0.0.1:8545",
    ipfsProvider: "http://127.0.0.1:5001/api/v0",
    web3ConnectProviderOptions: {},
  },
  rinkeby: {
    graphqlHttpProvider: SubgraphEndpoints.http_rinkeby,
    graphqlWsProvider: SubgraphEndpoints.ws_rinkeby,
    web3Provider: `wss://rinkeby.infura.io/ws/v3/${process.env.INFURA_ID}`,
    ipfsProvider: "https://api.thegraph.com:443/ipfs-daostack/api/v0",
    web3ConnectProviderOptions: {},
  },
  kovan: {
    graphqlHttpProvider: SubgraphEndpoints.http_kovan,
    graphqlWsProvider: SubgraphEndpoints.ws_kovan,
    web3Provider: `wss://kovan.infura.io/ws/v3/${process.env.INFURA_ID}`,
    ipfsProvider: "https://api.thegraph.com:443/ipfs-daostack/api/v0",
    web3ConnectProviderOptions: {},
  },
  xdai: {
    graphqlHttpProvider: SubgraphEndpoints.http_xdai,
    graphqlWsProvider: SubgraphEndpoints.ws_xdai,
    web3Provider:
      "https://poa.api.nodesmith.io/v1/dai/jsonrpc?apiKey=128059b9320a462699aef283a7ae2546",
    ipfsProvider: "https://api.thegraph.com:443/ipfs-daostack/api/v0",
    web3ConnectProviderOptions: {},
  },
  main: {
    graphqlHttpProvider: SubgraphEndpoints.http_main,
    graphqlWsProvider: SubgraphEndpoints.ws_main,
    web3Provider: `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_ID}`,
    ipfsProvider: "https://api.thegraph.com:443/ipfs-daostack/api/v0",
    web3ConnectProviderOptions: {},
  },
};
