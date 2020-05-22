import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import {
  Arc,
  ArcConfig,
  PluginData,
  ProposalData,
  Proposal,
  Plugin,
  PluginManagerPlugin,
  PluginManagerProposal,
} from "../../src";

const arcConfig = new ArcConfig("private");
const pluginId =
  "0xa8476a6c747d5f894c657d05d0e5ac1ed61b88f9126f272117f582cb2a1a5c1f";
const proposalId = "";

describe("Plugin manager component ", () => {
  afterEach(() => cleanup());

  it("Shows plugin name", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <PluginManagerPlugin id={pluginId}>
          <PluginManagerPlugin.Data>
            {(plugin: PluginData) => <div>{"Plugin name: " + plugin.name}</div>}
          </PluginManagerPlugin.Data>
        </PluginManagerPlugin>
      </Arc>
    );

    const name = await screen.findByText(/Plugin name:/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Plugin name: SchemeFactory
      </div>
    `);
  });

  it("Works with inferred plugin", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <Plugin id={pluginId}>
          <PluginManagerPlugin>
            <PluginManagerPlugin.Data>
              {(plugin: PluginData) => (
                <div>{"Plugin name: " + plugin.name}</div>
              )}
            </PluginManagerPlugin.Data>
          </PluginManagerPlugin>
        </Plugin>
      </Arc>
    );

    const name = await screen.findByText(/Plugin name:/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Plugin name: SchemeFactory
      </div>
    `);
  });
});

describe.skip("Proposal component ", () => {
  afterEach(() => cleanup());

  it("Shows proposal id", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <PluginManagerProposal id={proposalId}>
          <PluginManagerProposal.Data>
            {(proposal: ProposalData) => (
              <div>{"Proposal id: " + proposal.id}</div>
            )}
          </PluginManagerProposal.Data>
        </PluginManagerProposal>
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

  it("Works with inferred proposal", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <Proposal id={proposalId}>
          <PluginManagerProposal>
            <PluginManagerProposal.Data>
              {(proposal: ProposalData) => (
                <div>{"Proposal id: " + proposal.id}</div>
              )}
            </PluginManagerProposal.Data>
          </PluginManagerProposal>
        </Proposal>
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
