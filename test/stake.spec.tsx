import React from "react";
import { Arc, ArcConfig, StakeData, Stake, Stakes, useStake } from "../src";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
  cleanup,
  fireEvent,
} from "@testing-library/react";

const arcConfig = new ArcConfig("private");
const stakeId =
  "0x8da77eedf77582e746a3c92463bb07bff48fdbb6dc965fdbbfc45f3b468a7679";

describe("Stake component ", () => {
  afterEach(() => cleanup());

  it("Shows stake id", async () => {
    const { container, findByTestId } = render(
      <Arc config={arcConfig}>
        <Stake id={stakeId}>
          <Stake.Data>
            {(stake: StakeData) => <div>{"Stake id: " + stake.id}</div>}
          </Stake.Data>
        </Stake>
      </Arc>
    );

    const loader = await findByTestId("default-loader");
    fireEvent.mouseEnter(loader);
    const id = await screen.findByText(/Stake id:/);
    expect(id).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Stake id: ${stakeId}
      </div>
    `);
  });

  it("Shows id using useStake", async () => {
    const StakeWithHooks = () => {
      const [stakeData] = useStake();
      return <div>{"Stake id: " + stakeData?.id}</div>;
    };
    const { container, findByText } = render(
      <Arc config={arcConfig}>
        <Stake id={stakeId}>
          <StakeWithHooks />
        </Stake>
      </Arc>
    );

    const name = await findByText(
      /Stake id: 0x8da77eedf77582e746a3c92463bb07bff48fdbb6dc965fdbbfc45f3b468a7679/
    );
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Stake id: ${stakeId}
      </div>
    `);
  });
});

describe("Stake List", () => {
  afterEach(() => cleanup());
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
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 8000,
    });
    const stakes = await findAllByText(/Stake id:/);
    expect(stakes.length).toBeGreaterThan(1);
  });
});
