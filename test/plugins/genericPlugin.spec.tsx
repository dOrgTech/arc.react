import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import {
  Arc,
  ArcConfig,
  PluginData,
  GenericPlugin,
  Plugin,
  useGenericPlugin,
} from "../../src";

const arcConfig = new ArcConfig("private");
const pluginId =
  "0x19c537a34ac018f47faab97170e3725f35251c6b7d62c43317c604b498e24910";
const proposalId = "";
describe("Generic plugin component ", () => {
  afterEach(() => cleanup());

  it("Shows plugin name", async () => {
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

  it("Shows name using useGenericPlugin", async () => {
    const GenericPluginWithHooks = () => {
      const [genericPluginData] = useGenericPlugin();
      return <div>{"Plugin name: " + genericPluginData?.name}</div>;
    };
    const { container, findByText } = render(
      <Arc config={arcConfig}>
        <GenericPlugin id={pluginId}>
          <GenericPluginWithHooks />
        </GenericPlugin>
      </Arc>
    );

    const name = await findByText(/Plugin name: GenericScheme/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Plugin name: GenericScheme
      </div>
    `);
  });

  it("Works with inferred plugin", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <Plugin id={pluginId}>
          <GenericPlugin>
            <GenericPlugin.Data>
              {(plugin: PluginData) => (
                <div>{"Plugin name: " + plugin.name}</div>
              )}
            </GenericPlugin.Data>
          </GenericPlugin>
        </Plugin>
      </Arc>
    );

    const name = await screen.findByText(/Plugin name/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Plugin name: GenericScheme
      </div>
    `);
  });
});

/* describe("Proposal component ", () => {
  afterEach(() => cleanup());

  it("Shows proposal id", async () => {
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
}); */
