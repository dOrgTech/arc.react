import React from "react";
import {
  Arc,
  DevArcConfig as arcConfig,
  ReputationData,
  Reputation,
  DAO,
} from "../src";
import { render, screen } from "@testing-library/react";

describe("Reputation component ", () => {
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
                <div>{"Reputation DAO address: " + reputation.dao}</div>
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
