import React from "react";
import { Arc, ArcConfig, RewardData, Reward, Rewards, useReward } from "../src";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  cleanup,
} from "@testing-library/react";

const arcConfig = new ArcConfig("private");
const rewardId =
  "0x4c18c882ff760491e9d9fcc22ebf6494bbe57053f707f5a750a47177e7f8fdc4";

describe("Reward component ", () => {
  afterEach(() => cleanup());

  it("Shows reward id", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <Reward id={rewardId}>
          <Reward.Data>
            {(reward: RewardData) => <div>{"Reward id: " + reward.id}</div>}
          </Reward.Data>
        </Reward>
      </Arc>
    );

    const id = await screen.findByText(
      /Reward id: 0x4c18c882ff760491e9d9fcc22ebf6494bbe57053f707f5a750a47177e7f8fdc4/
    );
    expect(id).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Reward id: ${rewardId}
      </div>
    `);
  });

  it("Shows id using useReward", async () => {
    const RewardWithHooks = () => {
      const [rewardData] = useReward();
      return <div>{"Reward id: " + rewardData?.id}</div>;
    };
    const { container, findByText } = render(
      <Arc config={arcConfig}>
        <Reward id={rewardId}>
          <RewardWithHooks />
        </Reward>
      </Arc>
    );

    const name = await findByText(
      /Reward id: 0x4c18c882ff760491e9d9fcc22ebf6494bbe57053f707f5a750a47177e7f8fdc4/
    );
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Reward id: ${rewardId}
      </div>
    `);
  });
});

describe("Reward List", () => {
  afterEach(() => cleanup());

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
    const { findAllByText, queryAllByTestId } = render(<RewardList />);
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 8000,
    });
    const rewards = await findAllByText(/Reward id:/);
    expect(rewards.length).toBeGreaterThan(1);
  });
});
