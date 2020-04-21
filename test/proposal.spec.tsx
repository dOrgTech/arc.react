import React from "react";
import { Arc, DevArcConfig as arcConfig, ProposalData, Proposal } from "../src";
import { render, screen } from "@testing-library/react";

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
