import React from "react";
import { Arc, DevArcConfig as arcConfig, RewardData, Reward } from "../src";
import { render, screen } from "@testing-library/react";

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
