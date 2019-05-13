const filters = {
  filterProposalByStage: (stage: number) => {
    return {'stage': stage}
  },

  filterProposalByProposer: (proposer: any) => {
    return {'proposer': proposer}
  }
}

export default filters
