import React from "react";
import {
  Arc,
  DevArcConfig as arcConfig,
  StakeData,
  Stake,
  Stakes,
} from "../src";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";

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

describe("Stake List", () => {
  class StakeList extends React.Component {
    render() {
      return (
        <Arc config={arcConfig}>
          Stakes
          <Stakes>
            <Stake.Data>
              {(stake: StakeData) => <div>{"Stake id: " + stake.id}</div>}
            </Stake.Data>
          </Stakes>
        </Arc>
      );
    }
  }

  it("Show list of stake ", async () => {
    const { findAllByText, queryAllByTestId, findByText } = render(
      <StakeList />
    );
    await waitFor(() => findByText(/Stake id:/), {
      timeout: 3000,
    });
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 4000,
    });
    const stakes = await findAllByText(/Stake id:/);
    expect(stakes.length).toBeGreaterThan(1);
  });
});
