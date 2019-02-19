import { Arc } from '@daostack/client'
const graphqlHttpProvider: string = 'http://127.0.0.1:8000/subgraphs/name/daostack'
const graphqlWsProvider: string = 'ws://127.0.0.1:8001/subgraphs/name/daostack'
const web3Provider: string = 'http://127.0.0.1:8545'

const arc = new Arc({
  graphqlHttpProvider,
  graphqlWsProvider,
  web3Provider
})

export default arc;
