import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import {
  Arc,
  ArcConfig,
  PluginData,
  ProposalData,
  GenericPlugin,
  GenericPluginProposal,
} from "../../src";

const arcConfig = new ArcConfig("private");
const pluginId =
  "0x57990bf491095aebbaea7b13b733ccfc24d301a430de2f51d61aeb8e9a45c17c";
const proposalId =
  "0x2c320fa0e7a341cd28b8140247422b430c941390567ca3690fffc1e8577d3057";
describe("Plugin contribution reward component ", () => {
  afterEach(() => cleanup());

  it("Shows plugin name", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <GenericPlugin id={pluginId}>
          <GenericPlugin.Data>
            {(plugin: PluginData) => <div>{"Plugin name: " + plugin.name}</div>}
          </GenericPlugin.Data>
        </GenericPlugin>
      </Arc>
    );

    const name = await screen.findByText(/Plugin name:/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Plugin name: GenericScheme
      </div>
    `);
  });
});

describe.skip("Proposal component ", () => {
  afterEach(() => cleanup());

  it("Shows proposal id", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <GenericPluginProposal id={proposalId}>
          <GenericPluginProposal.Data>
            {(proposal: ProposalData) => (
              <div>{"Proposal id: " + proposal.id}</div>
            )}
          </GenericPluginProposal.Data>
        </GenericPluginProposal>
      </Arc>
    );

    const name = await screen.findByText(/Proposal id:/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Proposal id: ${proposalId}
      </div>
    `);
  });
});
