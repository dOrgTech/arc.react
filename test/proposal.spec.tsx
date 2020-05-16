import React from "react";
import { Arc, ArcConfig, ProposalData, Proposal, Proposals, DAO } from "../src";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
  cleanup,
} from "@testing-library/react";

const arcConfig = new ArcConfig("private");

const proposalId =
  "0x58fba3fe8b4d4090ecce931bdf826532700805b151cc22ee5fddd03750a4b444";
const daoAddress = "0x28d0cff49cc653632b91ef61ccb1b2cde7b952a9";

describe("Proposal component ", () => {
  afterEach(() => cleanup());

  it("Shows proposal id", async () => {
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
  afterEach(() => cleanup());
  class ProposalList extends React.Component {
    render() {
      return (
        <Arc config={arcConfig}>
          Proposals
          <DAO address={daoAddress}>
            <Proposals from="DAO">
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
      timeout: 8000,
    });
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 8000,
    });
    const proposals = await findAllByText(/Proposal id:/);
    expect(proposals.length).toBeGreaterThan(1);
  });
});
