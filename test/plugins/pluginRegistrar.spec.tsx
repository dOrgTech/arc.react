import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import {
  Arc,
  ArcConfig,
  PluginData,
  ProposalData,
  Proposal,
  Plugin,
  PluginRegistrarPlugin,
  PluginRegistrarProposal,
  usePluginRegistrarPlugin,
} from "../../src";

const arcConfig = new ArcConfig("private");
const pluginId =
  "0x4e28c6562903626006ff47f51fb71bd3870f7da5ae41470d6fc8aa132c899794";
const proposalId = "";

describe("Plugin manaer component ", () => {
  afterEach(() => cleanup());

  it("Shows plugin name", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <PluginRegistrarPlugin id={pluginId}>
          <PluginRegistrarPlugin.Data>
            {(plugin: PluginData) => <div>{"Plugin name: " + plugin.name}</div>}
          </PluginRegistrarPlugin.Data>
        </PluginRegistrarPlugin>
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

  it("Shows name using usePluginRegistrarPlugin", async () => {
    const PluginRegistrarPluginWithHooks = () => {
      const [PluginRegistrarPluginData] = usePluginRegistrarPlugin();
      return <div>{"Plugin name: " + PluginRegistrarPluginData?.name}</div>;
    };
    const { container, findByText } = render(
      <Arc config={arcConfig}>
        <PluginRegistrarPlugin id={pluginId}>
          <PluginRegistrarPluginWithHooks />
        </PluginRegistrarPlugin>
      </Arc>
    );

    const name = await findByText(/Plugin name: SchemeRegistrar/);
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
          <PluginRegistrarPlugin>
            <PluginRegistrarPlugin.Data>
              {(plugin: PluginData) => (
                <div>{"Plugin name: " + plugin.name}</div>
              )}
            </PluginRegistrarPlugin.Data>
          </PluginRegistrarPlugin>
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

describe.skip("Proposal component ", () => {
  afterEach(() => cleanup());

  it("Shows proposal id", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <PluginRegistrarProposal id={proposalId}>
          <PluginRegistrarProposal.Data>
            {(proposal: ProposalData) => (
              <div>{"Proposal id: " + proposal.id}</div>
            )}
          </PluginRegistrarProposal.Data>
        </PluginRegistrarProposal>
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
          <PluginRegistrarProposal>
            <PluginRegistrarProposal.Data>
              {(proposal: ProposalData) => (
                <div>{"Proposal id: " + proposal.id}</div>
              )}
            </PluginRegistrarProposal.Data>
          </PluginRegistrarProposal>
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
