import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import {
  Arc,
  ArcConfig,
  PluginData,
  ProposalData,
  Proposal,
  Plugin,
  ContributionRewardExtPlugin,
  ContributionRewardProposal,
  ContributionRewardPluginEntity,
} from "../../src";

const arcConfig = new ArcConfig("private");
const pluginId =
  "0x5f83d01d4a450819f46c9c8c4e7903a0367ae87d617b38e8946a6b9a13eb141c";
const proposalId = "";

describe("Plugin contribution reward ext component ", () => {
  afterEach(() => cleanup());

  it("Shows plugin name", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <ContributionRewardExtPlugin id={pluginId}>
          <ContributionRewardExtPlugin.Data>
            {(plugin: PluginData) => <div>{"Plugin name: " + plugin.name}</div>}
          </ContributionRewardExtPlugin.Data>
        </ContributionRewardExtPlugin>
      </Arc>
    );

    const name = await screen.findByText(/Plugin name:/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Plugin name: ContributionRewardExt
      </div>
    `);
  });

  it("Works with inferred plugin", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <Plugin id={pluginId}>
          <ContributionRewardExtPlugin>
            <ContributionRewardExtPlugin.Data>
              {(plugin: PluginData) => (
                <div>{"Plugin name: " + plugin.name}</div>
              )}
            </ContributionRewardExtPlugin.Data>
          </ContributionRewardExtPlugin>
        </Plugin>
      </Arc>
    );

    const name = await screen.findByText(/Plugin name:/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Plugin name: ContributionRewardExt
      </div>
    `);
  });
});
