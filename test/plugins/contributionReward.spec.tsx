import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import {
  Arc,
  ArcConfig,
  PluginData,
  ProposalData,
  ContributionRewardPlugin,
  ContributionRewardProposal,
} from "../../src";

const arcConfig = new ArcConfig("private");

describe("Plugin contribution reward component ", () => {
  afterEach(() => cleanup());

  it("Shows plugin name", async () => {
    const pluginId =
      "0x46de2811ac54ddf952ae36815c7a6e2358ad023f3155df7c48e214157edbdb07";
    const { container } = render(
      <Arc config={arcConfig}>
        <ContributionRewardPlugin id={pluginId}>
          <ContributionRewardPlugin.Data>
            {(plugin: PluginData) => <div>{"Plugin name: " + plugin.name}</div>}
          </ContributionRewardPlugin.Data>
        </ContributionRewardPlugin>
      </Arc>
    );

    const name = await screen.findByText(/Plugin name:/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Plugin name: ContributionReward
      </div>
    `);
  });
});

describe("Proposal component ", () => {
  afterEach(() => cleanup());

  it("Shows proposal id", async () => {
    const proposalId =
      "0x02fd1079f9a842581eb742ea44507a461466b791c2990783732bfe660aa6a711";
    const { container } = render(
      <Arc config={arcConfig}>
        <ContributionRewardProposal id={proposalId}>
          <ContributionRewardProposal.Data>
            {(proposal: ProposalData) => (
              <div>{"Proposal id: " + proposal.id}</div>
            )}
          </ContributionRewardProposal.Data>
        </ContributionRewardProposal>
      </Arc>
    );

    const name = await screen.findByText(/ContributionRewardProposal id:/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        ContributionRewardProposal id: ${proposalId}
      </div>
    `);
  });
});
