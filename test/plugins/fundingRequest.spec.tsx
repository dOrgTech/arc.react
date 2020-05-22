import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import {
  Arc,
  ArcConfig,
  PluginData,
  Plugin,
  FundingRequestPlugin,
  useFundingRequestPlugin,
} from "../../src";

const arcConfig = new ArcConfig("private");
const pluginId =
  "0x05e0ab974aee02d06e157daba6709a01384fb1f25ec691606133ffb15c162768";
const proposalId = "";

describe("Plugin contribution reward ext component ", () => {
  afterEach(() => cleanup());

  it("Shows plugin name", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <FundingRequestPlugin id={pluginId}>
          <FundingRequestPlugin.Data>
            {(plugin: PluginData) => <div>{"Plugin name: " + plugin.name}</div>}
          </FundingRequestPlugin.Data>
        </FundingRequestPlugin>
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

  it("Shows name using useFundingRequestPlugin", async () => {
    const FundingRequestPluginWithHooks = () => {
      const [fundingRequestPluginData] = useFundingRequestPlugin();
      return <div>{"Plugin name: " + fundingRequestPluginData?.name}</div>;
    };
    const { container, findByText } = render(
      <Arc config={arcConfig}>
        <FundingRequestPlugin id={pluginId}>
          <FundingRequestPluginWithHooks />
        </FundingRequestPlugin>
      </Arc>
    );

    const name = await findByText(/Plugin name: FundingRequest/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Plugin name: FundingRequest
      </div>
    `);
  });

  it("Works with inferred plugin", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <Plugin id={pluginId}>
          <FundingRequestPlugin>
            <FundingRequestPlugin.Data>
              {(plugin: PluginData) => (
                <div>{"Plugin name: " + plugin.name}</div>
              )}
            </FundingRequestPlugin.Data>
          </FundingRequestPlugin>
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
});
