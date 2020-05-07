import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import {
  Arc,
  ArcConfig,
  PluginData,
  ProposalData,
  Proposal,
  Plugin,
  PluginManager,
  PluginManagerProposal,
} from "../../src";

const arcConfig = new ArcConfig("private");
const pluginId =
  "0x63f80cbfc4a795d6dd8c71d86beb55aace9a69fe72e7b89f3d57e6c852a2a39f";
const proposalId = "";

describe("Plugin manaer component ", () => {
  afterEach(() => cleanup());

  it("Shows plugin name", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <PluginManager id={pluginId}>
          <PluginManager.Data>
            {(plugin: PluginData) => <div>{"Plugin name: " + plugin.name}</div>}
          </PluginManager.Data>
        </PluginManager>
      </Arc>
    );

    const name = await screen.findByText(/Plugin name:/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Plugin name: SchemeRegistrar
      </div>
    `);
  });

  it("Works with inferred plugin", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <Plugin id={pluginId}>
          <PluginManager>
            <PluginManager.Data>
              {(plugin: PluginData) => (
                <div>{"Plugin name: " + plugin.name}</div>
              )}
            </PluginManager.Data>
          </PluginManager>
        </Plugin>
      </Arc>
    );

    const name = await screen.findByText(/Plugin name:/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Plugin name: SchemeRegistrar
      </div>
    `);
  });
});

// we are skiping because we have not created proposals yet
/* describe("Proposal component ", () => {
  afterEach(() => cleanup());

  it("Shows proposal id", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <PluginManagerProposal id={proposalId}>
          <PluginManagerProposal.Data>
            {(proposal: ProposalData) => <div>{"Proposal id: " + proposal.id}</div>}
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
              {(proposal: ProposalData) => <div>{"Proposal id: " + proposal.id}</div>}
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
}); */
