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

describe("Proposal component ", () => {
  afterEach(() => cleanup());

  it("Shows proposal id", async () => {
    const proposalId =
      "0x02fd1079f9a842581eb742ea44507a461466b791c2990783732bfe660aa6a711";
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

  const daoAddress = "0x02981ec0aefe7329442c39dfe5a52fb8781e7659";
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
      timeout: 8000,
    });
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 8000,
    });
    const proposals = await findAllByText(/Proposal id:/);
    expect(proposals.length).toBeGreaterThan(1);
  });
});
