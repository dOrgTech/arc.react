import React from "react";
import { Arc, ArcConfig, VoteData, Vote, Votes } from "../src";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
  cleanup,
} from "@testing-library/react";

const arcConfig = new ArcConfig("private");
const voteId =
  "0x33472fe4769ad20fbb6e14d28074d0f21e7e0a34b09edd2b841714575c5e0da6";

describe("Vote component ", () => {
  afterEach(() => cleanup());

  it("Shows vote id", async () => {
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
  afterEach(() => cleanup());

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
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 8000,
    });
    const votes = await findAllByText(/Vote id:/);
    expect(votes.length).toBeGreaterThan(1);
  });
});
