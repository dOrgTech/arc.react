import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
  cleanup,
} from "@testing-library/react";
import {
  Arc,
  ArcConfig,
  ReputationData,
  Reputation,
  Reputations,
  DAO,
  useReputation,
} from "../src";

const arcConfig = new ArcConfig("private");
const reputationAddress = "0x146ab4120754cd4f15c1c831e0741064ccc36cae";
const daoAddress = "0xea3a0a94d174dba202ba843f0460a49c87a64a9c";

describe("Reputation component ", () => {
  afterEach(() => cleanup());

  it("Shows reputation address", async () => {
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

  it("Shows address and DAO using useReputation", async () => {
    const ReputationWithHooks = () => {
      const [reputationData] = useReputation();
      return (
        <div>
          {"Reputation address: " + reputationData?.address}
          {"Reputation DAO address: " + reputationData?.dao.id}
        </div>
      );
    };
    const { container, findByText } = render(
      <Arc config={arcConfig}>
        <DAO address={daoAddress}>
          <Reputation>
            <ReputationWithHooks />
          </Reputation>
        </DAO>
      </Arc>
    );

    const name = await findByText(
      `Reputation address: ${reputationAddress}` +
        `Reputation DAO address: ${daoAddress}`
    );
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Reputation address: ${reputationAddress}
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
