index
- initialize web3
- set/initialize protocol
- set dao address

Proposal
- interface (on-chain state fetch, off-chain state set / fetch)

impl/DAOstack/Proposal

Ideal Data Model:
ProposalLogs [
  on-chain state ref,
  on-chain state ref,
  null,
  on-chain state ref (block num, tx hash, etc)
]  

Proposal [
  proposal data,
  proposal data,
  proposal data,
  proposal data
]  
