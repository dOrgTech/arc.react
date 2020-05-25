# Recipes

Here are some tricks that you can do when using the library. All these have been implemented in the demo app previously mentioned in the README.

## Showing members with their reputation percentage

```html
<DAO address="0x">
  <Members from="DAO">
    <DAO.Data>
      <Member.Data>
        {(daoData: DAOData, memberData: MemberData) => { const memberPercentage
        = (Number(memberData.reputation) * 100) /
        Number(daoData.reputationTotalSupply) return (
        <div>
          <p>{memberData.address}</p>
          <p>{memberPercentage.toFixed(2)}</p>
        </div>
        ); }}
      </Member.Data>
    </DAO.Data>
  </Members>
</DAO>
```

## Filtering proposals

In this example we are going to show the latest **active** proposals from the DAO, and make a button to vote for them. NOTE: The user must be logged in otherwise the vote will fail

```tsx
const activeProposals = {
  where: { stage_in: [2, 3, 4, 5] },
  orderBy: "closingAt",
  orderDirection: "desc",
};
<Proposals filter={activeProposals} from="DAO">
  <Proposal.Data>
    <Proposal.Entity>
      {(proposalData: ProposalData, proposalEntity: ProposalEntity) => (
        <div>
          <p> {proposalData.title} </p>
          <button
            onClick={async (e) => {
              await proposalEntity.vote(1).send();
            }}
          >
            Vote for
          </button>
        </div>
      )}
    </Proposal.Entity>
  </Proposal.Data>
</Proposals>;
```

## Showing the percentage of votes against a proposal

```tsx
const showPercentage = (votes: BN, totalRep: BN) => {
  return votes
    .muln(100)
    .div(totalRep)
    .toNumber();
};
<DAO address="0xDAO_Address">
  <Proposal id="0xProposal_ID">
    <DAO.Data>
      <Proposal.Data>
        ({daoData; DAOData, proposalData: ProposalData) => (
          <div>
           Votes for: {showPercentage(proposalData.votesFor, DAOData.reputationTotalSupply)} - Votes against: {showPercentage(proposalData.votesAgainst, DAOData.reputationTotalSupply)}
          </div>
        )})
      </Proposal.Data>
    </DAO.Data>
  </Proposal>
</DAO>
```
