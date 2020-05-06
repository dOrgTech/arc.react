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

describe("Plugin contribution reward component ", () => {
  afterEach(() => cleanup());

  it("Shows plugin name", async () => {
    const pluginId =
      "0x5203df9755c89711c0a79dd12b17dc0f5ac2fc7e4e50fb4a64844e51068b144f";
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

describe("Proposal component ", () => {
  afterEach(() => cleanup());

  it("Shows proposal id", async () => {
    const proposalId =
      "0x2c320fa0e7a341cd28b8140247422b430c941390567ca3690fffc1e8577d3057";
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
