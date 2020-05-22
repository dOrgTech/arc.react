import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import {
  Arc,
  ArcConfig,
  PluginData,
  Plugin,
  ReputationFromTokenPlugin,
  useReputationFromTokenPlugin,
} from "../../src";

const arcConfig = new ArcConfig("private");
const pluginId =
  "0x5deef0cf4b6cddbe1a75aba33da32b945526d20192253f153ae2bb009aaacf14";
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

  it("Shows name using useReputationFromTokenPlugin", async () => {
    const ReputationFromTokenPluginWithHooks = () => {
      const [ReputationFromTokenPluginData] = useReputationFromTokenPlugin();
      return <div>{"Plugin name: " + ReputationFromTokenPluginData?.name}</div>;
    };
    const { container, findByText } = render(
      <Arc config={arcConfig}>
        <ReputationFromTokenPlugin id={pluginId}>
          <ReputationFromTokenPluginWithHooks />
        </ReputationFromTokenPlugin>
      </Arc>
    );

    const name = await findByText(/Plugin name: ReputationFromToken/);
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
