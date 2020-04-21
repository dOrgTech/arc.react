import React from "react";
import { Arc, DevArcConfig as arcConfig, StakeData, Stake } from "../src";
import { render, screen } from "@testing-library/react";

describe("Stake component ", () => {
  it("Shows stake id", async () => {
    const stakeId =
      "0xb6398a75633d9af9928ae4fe6c0db4105e52514bd0321a77ca6ae7a8d5e60971";
    const { container } = render(
      <Arc config={arcConfig}>
        <Stake id={stakeId}>
          <Stake.Data>
            {(stake: StakeData) => <div>{"Stake id: " + stake.id}</div>}
          </Stake.Data>
        </Stake>
      </Arc>
    );

    const id = await screen.findByText(/Stake id:/);
    expect(id).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Stake id: ${stakeId}
      </div>
    `);
  });
});
