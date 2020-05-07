import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import {
  Arc,
  ArcConfig,
  PluginData,
  ProposalData,
  Proposal,
  Plugin,
  ReputationFromTokenPlugin,
} from "../../src";

const arcConfig = new ArcConfig("private");
const pluginId =
  "0x41ddc9526845c5a6697de569d52885d5f045e4e081745a1790aa97724955dbdd";
const proposalId = "";

describe("Reputation from token plugin component ", () => {
  afterEach(() => cleanup());

  it("Shows plugin name", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <ReputationFromTokenPlugin id={pluginId}>
          <ReputationFromTokenPlugin.Data>
            {(plugin: PluginData) => <div>{"Plugin name: " + plugin.name}</div>}
          </ReputationFromTokenPlugin.Data>
        </ReputationFromTokenPlugin>
      </Arc>
    );

    const name = await screen.findByText(/Plugin name:/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Plugin name: ReputationFromToken
      </div>
    `);
  });

  it("Works with inferred plugin", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <Plugin id={pluginId}>
          <ReputationFromTokenPlugin>
            <ReputationFromTokenPlugin.Data>
              {(plugin: PluginData) => (
                <div>{"Plugin name: " + plugin.name}</div>
              )}
            </ReputationFromTokenPlugin.Data>
          </ReputationFromTokenPlugin>
        </Plugin>
      </Arc>
    );

    const name = await screen.findByText(/Plugin name:/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Plugin name: ReputationFromToken
      </div>
    `);
  });
});
