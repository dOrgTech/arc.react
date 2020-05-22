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
  ContributionRewardExtPluginEntity,
  useContributionRewardExtPlugin,
} from "../../src";

const arcConfig = new ArcConfig("private");
const pluginId =
  "0x1b3aedd67a272608f5b5a902c49fc7e68697915f4af48176ccfb8c86c47c7126";
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

  it("Shows name using useContributionRewardExtPlugin", async () => {
    const ContributionRewardExtPluginWithHooks = () => {
      const [contributionRewardPluginData] = useContributionRewardExtPlugin();
      return <div>{"Plugin name: " + contributionRewardPluginData?.name}</div>;
    };
    const { container, findByText } = render(
      <Arc config={arcConfig}>
        <ContributionRewardExtPlugin id={pluginId}>
          <ContributionRewardExtPluginWithHooks />
        </ContributionRewardExtPlugin>
      </Arc>
    );

    const name = await findByText(/Plugin name: ContributionRewardExt/);
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
