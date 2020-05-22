import React from "react";
import { Arc, ArcConfig, PluginData, Plugin, Plugins, usePlugin } from "../src";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
  cleanup,
} from "@testing-library/react";

const arcConfig = new ArcConfig("private");
const pluginId =
  "0x05e0ab974aee02d06e157daba6709a01384fb1f25ec691606133ffb15c162768";

describe("Plugin component ", () => {
  afterEach(() => cleanup());

  it("Shows plugin name", async () => {
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
        Plugin name: FundingRequest
      </div>
    `);
  });

  it("Shows id using usePlugin", async () => {
    const PluginWithHooks = () => {
      const [pluginData] = usePlugin();
      return <div>{"Plugin id: " + pluginData?.id}</div>;
    };
    const { container, findByText } = render(
      <Arc config={arcConfig}>
        <Plugin id={pluginId}>
          <PluginWithHooks />
        </Plugin>
      </Arc>
    );

    const name = await findByText(`Plugin id: ${pluginId}`);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Plugin id: ${pluginId}
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
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 20000,
    });
    await waitFor(() => findByText(`Plugin id: ${pluginId}`), {
      timeout: 20000,
    });
    const plugins = await findAllByText(/Plugin id:/);
    expect(plugins.length).toBeGreaterThan(1);
  });
});
