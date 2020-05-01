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
      "0x0cb9948676fa48ea01b8bb0aada44ebd3b298d50e618ec823cfab456e42c71c2";
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
      timeout: 8000,
    });
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 8000,
    });
    const rewards = await findAllByText(/Reward id:/);
    expect(rewards.length).toBeGreaterThan(1);
  });
});
