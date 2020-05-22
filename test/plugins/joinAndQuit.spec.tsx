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
  useJoinAndQuitPlugin,
} from "../../src";

const arcConfig = new ArcConfig("private");
const pluginId =
  "0xb9c043dbc570879a4cb75413c5184df0cd6c17a5af3767f240bea6b94d7885bc";
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

  it("Shows name using useJoinAndQuitPlugin", async () => {
    const JoinAndQuitPluginWithHooks = () => {
      const [joinAndQuitPluginData] = useJoinAndQuitPlugin();
      return <div>{"Plugin name: " + joinAndQuitPluginData?.name}</div>;
    };
    const { container, findByText } = render(
      <Arc config={arcConfig}>
        <JoinAndQuitPlugin id={pluginId}>
          <JoinAndQuitPluginWithHooks />
        </JoinAndQuitPlugin>
      </Arc>
    );

    const name = await findByText(/Plugin name: JoinAndQuit/);
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
