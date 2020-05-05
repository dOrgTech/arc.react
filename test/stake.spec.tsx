import React from "react";
import { Arc, ArcConfig, StakeData, Stake, Stakes } from "../src";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
  cleanup,
} from "@testing-library/react";

const arcConfig = new ArcConfig("private");

describe("Stake component ", () => {
  afterEach(() => cleanup());

  it("Shows stake id", async () => {
    const stakeId =
      "0x3d6b71c0fa97d433642c45b0b2f9642e0c79d0258ad4ff4dce667222dc15f526";
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
  // afterEach(() => cleanup());
  // class StakeList extends React.Component {
  //   render() {
  //     return (
  //       <Arc config={arcConfig}>
  //         Stakes
  //         <Stakes>
  //           <Stake.Data>
  //             {(stake: StakeData) => <div>{"Stake id: " + stake.id}</div>}
  //           </Stake.Data>
  //         </Stakes>
  //       </Arc>
  //     );
  //   }
  // }
  // it("Show list of stake ", async () => {
  //   const { findAllByText, queryAllByTestId, findByText } = render(
  //     <StakeList />
  //   );
  //   await waitFor(() => findByText(/Stake id:/), {
  //     timeout: 8000,
  //   });
  //   await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
  //     timeout: 8000,
  //   });
  //   const stakes = await findAllByText(/Stake id:/);
  //   expect(stakes.length).toBeGreaterThan(1);
  // });
});
