import React from "react";
import {
  Arc,
  DevArcConfig as arcConfig,
  ProposalData,
  Proposal,
  Proposals,
  DAO,
} from "../src";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";

describe("Proposal component ", () => {
  it("Shows proposal id", async () => {
    const proposalId =
      "0x6afee092a28c74f6358093d5376ac75014ac4d9fd42d296a5498ef42eecd7248";
    const { container } = render(
      <Arc config={arcConfig}>
        <Proposal id={proposalId}>
          <Proposal.Data>
            {(proposal: ProposalData) => (
              <div>{"Proposal id: " + proposal.id}</div>
            )}
          </Proposal.Data>
        </Proposal>
      </Arc>
    );

    const name = await screen.findByText(/Proposal id:/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Proposal id: ${proposalId}
      </div>
    `);
  });
});

describe("Proposal List", () => {
  const daoAddress = "0xe7a2c59e134ee81d4035ae6db2254f79308e334f";
  class ProposalList extends React.Component {
    render() {
      return (
        <Arc config={arcConfig}>
          Proposals
          <DAO address={daoAddress}>
            <Proposals>
              <Proposal.Data>
                {(proposal: ProposalData) => (
                  <div>{"Proposal id: " + proposal.id}</div>
                )}
              </Proposal.Data>
            </Proposals>
          </DAO>
        </Arc>
      );
    }
  }

  it("Show list of proposal ", async () => {
    const { findAllByText, queryAllByTestId, findByText } = render(
      <ProposalList />
    );
    await waitFor(() => findByText(/Proposal id/), {
      timeout: 3000,
    });
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 4000,
    });
    const proposals = await findAllByText(/Proposal id:/);
    expect(proposals.length).toBeGreaterThan(1);
  });
});
