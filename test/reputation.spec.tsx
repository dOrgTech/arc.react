import React from "react";
import {
  Arc,
  ArcConfig,
  ReputationData,
  Reputation,
  Reputations,
  DAO,
} from "../src";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
  cleanup,
} from "@testing-library/react";

const arcConfig = new ArcConfig("private");

describe("Reputation component ", () => {
  afterEach(() => cleanup());

  it("Shows reputation address", async () => {
    const reputationAddress = "0x93cdbf39fb9e13bd253ca5819247d52fbabf0f2f";
    const { container } = render(
      <Arc config={arcConfig}>
        <Reputation address={reputationAddress}>
          <Reputation.Data>
            {(reputation: ReputationData) => (
              <div>{"Reputation address: " + reputation.address}</div>
            )}
          </Reputation.Data>
        </Reputation>
      </Arc>
    );

    const address = await screen.findByText(/Reputation address:/);
    expect(address).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Reputation address: ${reputationAddress}
      </div>
    `);
  });

  it("Shows DAO reputation address with inferred props", async () => {
    const daoAddress = "0xe7a2c59e134ee81d4035ae6db2254f79308e334f";
    const { container } = render(
      <Arc config={arcConfig}>
        <DAO address={daoAddress}>
          <Reputation>
            <Reputation.Data>
              {(reputation: ReputationData) => (
                <div>{"Reputation DAO address: " + reputation.dao.id}</div>
              )}
            </Reputation.Data>
          </Reputation>
        </DAO>
      </Arc>
    );

    const dao = await screen.findByText(/Reputation DAO address:/);
    expect(dao).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Reputation DAO address: ${daoAddress}
      </div>
    `);
  });
});

describe("Reputation List", () => {
  afterEach(() => cleanup());

  class ReputationList extends React.Component {
    render() {
      return (
        <Arc config={arcConfig}>
          Reputations
          <Reputations>
            <Reputation.Data>
              {(reputation: ReputationData) => (
                <div>{"Reputation address: " + reputation.address}</div>
              )}
            </Reputation.Data>
          </Reputations>
        </Arc>
      );
    }
  }

  it("Show list of reputation ", async () => {
    const { findAllByText, queryAllByTestId, findByText } = render(
      <ReputationList />
    );
    await waitFor(() => findByText(/Reputation address:/), {
      timeout: 8000,
    });
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 8000,
    });
    const reputations = await findAllByText(/Reputation address:/);
    expect(reputations.length).toBeGreaterThan(1);
  });
});
