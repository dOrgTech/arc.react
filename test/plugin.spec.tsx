import React from "react";
import { Arc, ArcConfig, PluginData, Plugin, Plugins } from "../src";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
  cleanup,
} from "@testing-library/react";

const arcConfig = new ArcConfig("private");

describe("Plugin component ", () => {
  afterEach(() => cleanup());

  it("Shows plugin name", async () => {
    const pluginId =
      "0x940f04d8fd1caca273cf05f1735362936280181684bc426f09cfba0265db47e4";
    const { container } = render(
      <Arc config={arcConfig}>
        <Plugin id={pluginId}>
          <Plugin.Data>
            {(plugin: PluginData) => <div>{"Plugin name: " + plugin.name}</div>}
          </Plugin.Data>
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

describe("Plugin List", () => {
  afterEach(() => cleanup());
  class PluginList extends React.Component {
    render() {
      return (
        <Arc config={arcConfig}>
          Plugins
          <Plugins>
            <Plugin.Data>
              {(plugin: PluginData) => <div>{"Plugin id: " + plugin.id}</div>}
            </Plugin.Data>
          </Plugins>
        </Arc>
      );
    }
  }

  it("Show list of plugin ", async () => {
    const { findAllByText, queryAllByTestId, findByText } = render(
      <PluginList />
    );
    await waitFor(() => findByText(/Plugin id:/), {
      timeout: 20000,
    });
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 20000,
    });
    const plugins = await findAllByText(/Plugin id:/);
    expect(plugins.length).toBeGreaterThan(1);
  });
});
