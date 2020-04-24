import React from "react";
import {
  Arc,
  DevArcConfig as arcConfig,
  RewardData,
  Reward,
  Rewards,
} from "../src";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";

describe("Reward component ", () => {
  it("Shows reward id", async () => {
    const rewardId =
      "0xc0c911eafd30e6bb1f1f2b4a8cf401bf355a5e066a3af50e8ef7b09dd68e65db";
    const { container } = render(
      <Arc config={arcConfig}>
        <Reward id={rewardId}>
          <Reward.Data>
            {(reward: RewardData) => <div>{"Reward id: " + reward.id}</div>}
          </Reward.Data>
        </Reward>
      </Arc>
    );

    const id = await screen.findByText(/Reward id:/);
    expect(id).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Reward id: ${rewardId}
      </div>
    `);
  });
});

describe("Reward List", () => {
  class RewardList extends React.Component {
    render() {
      return (
        <Arc config={arcConfig}>
          Rewards
          <Rewards>
            <Reward.Data>
              {(reward: RewardData) => <div>{"Reward id: " + reward.id}</div>}
            </Reward.Data>
          </Rewards>
        </Arc>
      );
    }
  }

  it("Show list of reward ", async () => {
    const { findAllByText, queryAllByTestId, findByText } = render(
      <RewardList />
    );
    await waitFor(() => findByText(/Reward id:/), {
      timeout: 3000,
    });
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 5000,
    });
    const rewards = await findAllByText(/Reward id:/);
    expect(rewards.length).toBeGreaterThan(1);
  });
});
