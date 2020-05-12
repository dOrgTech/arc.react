import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import {
  Arc,
  ArcConfig,
  PluginData,
  ProposalData,
  Proposal,
  Plugin,
  JoinAndQuitPlugin,
  JoinAndQuitProposal,
  JoinAndQuitPluginEntity,
} from "../../src";

const arcConfig = new ArcConfig("private");
const pluginId =
  "0x500fbca403f233baf935def9e2b06b380837c8a5047b740c179e68de74b5c986";
const proposalId = "";

describe("Plugin contribution reward ext component ", () => {
  afterEach(() => cleanup());

  it("Shows plugin name", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <JoinAndQuitPlugin id={pluginId}>
          <JoinAndQuitPlugin.Data>
            {(plugin: PluginData) => <div>{"Plugin name: " + plugin.name}</div>}
          </JoinAndQuitPlugin.Data>
        </JoinAndQuitPlugin>
      </Arc>
    );

    const name = await screen.findByText(/Plugin name:/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Plugin name: JoinAndQuit
      </div>
    `);
  });

  it("Works with inferred plugin", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <Plugin id={pluginId}>
          <JoinAndQuitPlugin>
            <JoinAndQuitPlugin.Data>
              {(plugin: PluginData) => (
                <div>{"Plugin name: " + plugin.name}</div>
              )}
            </JoinAndQuitPlugin.Data>
          </JoinAndQuitPlugin>
        </Plugin>
      </Arc>
    );

    const name = await screen.findByText(/Plugin name:/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Plugin name: JoinAndQuit
      </div>
    `);
  });
});
