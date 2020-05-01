import React from "react";
import { Arc, DevArcConfig as arcConfig, VoteData, Vote, Votes } from "../src";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";

describe("Vote component ", () => {
  it("Shows vote id", async () => {
    const voteId =
      "0x0795aafa7207e2c48241fa432f1f66789e0d2a2e2802208ced7ca3ff216dc74e";
    const { container } = render(
      <Arc config={arcConfig}>
        <Vote id={voteId}>
          <Vote.Data>
            {(vote: VoteData) => <div>{"Vote id: " + vote.id}</div>}
          </Vote.Data>
        </Vote>
      </Arc>
    );

    const id = await screen.findByText(/Vote id:/);
    expect(id).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Vote id: ${voteId}
      </div>
    `);
  });
});

describe("Vote List", () => {
  class VoteList extends React.Component {
    render() {
      return (
        <Arc config={arcConfig}>
          Votes
          <Votes>
            <Vote.Data>
              {(vote: VoteData) => <div>{"Vote id: " + vote.id}</div>}
            </Vote.Data>
          </Votes>
        </Arc>
      );
    }
  }

  it("Show list of vote ", async () => {
    const { findAllByText, queryAllByTestId, findByText } = render(
      <VoteList />
    );
    await waitFor(() => findByText(/Vote id/), {
      timeout: 8000,
    });
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 8000,
    });
    const votes = await findAllByText(/Vote id:/);
    expect(votes.length).toBeGreaterThan(1);
  });
});
