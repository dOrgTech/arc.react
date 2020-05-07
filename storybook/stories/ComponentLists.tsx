import * as React from "react";
import { storiesOf } from "@storybook/react";
import {
  Arc,
  ArcConfig,
  DAOs,
  DAO,
  DAOData,
  Members,
  Member,
  MemberData,
  Proposal,
  Proposals,
  ProposalData,
  Reputations,
  Reputation,
  ReputationData,
  Tokens,
  Token,
  TokenData,
  Rewards,
  Reward,
  RewardData,
  Plugin,
  Plugins,
  PluginData,
  Stakes,
  Stake,
  StakeData,
  Votes,
  Vote,
  VoteData,
  Loader,
  LoadingRenderProps,
} from "../../src/";
import ComponentListView, {
  PropertyType,
  PropertyData,
} from "../helpers/ComponentListView";

const DAOProp: PropertyData = {
  friendlyName: "DAO Address",
  name: "dao",
  defaultValue: "0x666a6eb4618d0438511c8206df4d5b142837eb0d",
  type: PropertyType.string,
};

const MemberProp: PropertyData = {
  friendlyName: "Member Address",
  name: "member",
  defaultValue: "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
  type: PropertyType.string,
};

const ProposalProp: PropertyData = {
  friendlyName: "Proposal ID",
  name: "proposal",
  defaultValue:
    "0x58fba3fe8b4d4090ecce931bdf826532700805b151cc22ee5fddd03750a4b444",
  type: PropertyType.string,
};

const TokenProp: PropertyData = {
  friendlyName: "Token Address",
  name: "token",
  defaultValue: "0x24014c20291afc04145a0bf5b5cdf58dc3f3b809",
  type: PropertyType.string,
};

const arcConfig = new ArcConfig("private");

export default () =>
  storiesOf("Component Lists", module)
    .add("DAOs", () => (
      <ComponentListView
        name={"DAOs"}
        ComponentListType={DAOs}
        ComponentType={DAO}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        getId={(dao: DAOData) => `DAO: ${dao.address}`}
      />
    ))
    .add("Members", () => (
      <ComponentListView
        name={"Members"}
        ComponentListType={Members}
        ComponentType={Member}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        scopes={[{ name: "DAO", prop: DAOProp }]}
        ScopeContext={(props) => (
          <DAO address={props.dao}>{props.children}</DAO>
        )}
        getId={(member: MemberData) => `Member: ${member.address}`}
      />
    ))
    .add("Proposals", () => (
      <ComponentListView
        name={"Proposals"}
        ComponentListType={Proposals}
        ComponentType={Proposal}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        scopes={[
          { name: "DAO", prop: DAOProp },
          { name: "Member as proposer", prop: MemberProp },
        ]}
        ScopeContext={(props) => (
          <DAO address={props.dao}>
            <Member address={props.member}>{props.children}</Member>
          </DAO>
        )}
        getId={(proposal: ProposalData) => `Proposal: ${proposal.id}`}
      />
    ))
    .add("Reputations", () => (
      <ComponentListView
        name={"Reputations"}
        ComponentListType={Reputations}
        ComponentType={Reputation}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        getId={(reputation: ReputationData) =>
          `Reputation: ${reputation.address}`
        }
      />
    ))
    .add("Rewards", () => (
      <ComponentListView
        name={"Rewards"}
        ComponentListType={Rewards}
        ComponentType={Reward}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        scopes={[
          { name: "DAO", prop: DAOProp },
          { name: "Member as beneficiary", prop: MemberProp },
          { name: "Proposal", prop: ProposalProp },
          { name: "Token", prop: TokenProp },
        ]}
        ScopeContext={(props) => (
          <DAO address={props.dao}>
            <Member address={props.member}>
              <Proposal id={props.proposal}>
                <Token address={props.token}>{props.children}</Token>
              </Proposal>
            </Member>
          </DAO>
        )}
        getId={(reward: RewardData) => `Reward: ${reward.id}`}
      />
    ))
    .add("Plugin", () => (
      <ComponentListView
        name={"Plugin"}
        ComponentListType={Plugins}
        ComponentType={Plugin}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        scopes={[{ name: "DAO", prop: DAOProp }]}
        ScopeContext={(props) => (
          <DAO address={props.dao}>{props.children}</DAO>
        )}
        getId={(scheme: PluginData) => `Plugin (${scheme.name}): ${scheme.id}`}
      />
    ))
    .add("Stakes", () => (
      <ComponentListView
        name={"Stakes"}
        ComponentListType={Stakes}
        ComponentType={Stake}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        scopes={[
          { name: "DAO", prop: DAOProp },
          { name: "Member as staker", prop: MemberProp },
          { name: "Proposal", prop: ProposalProp },
        ]}
        ScopeContext={(props) => (
          <DAO address={props.dao}>
            <Member address={props.member}>
              <Proposal id={props.proposal}>{props.children}</Proposal>
            </Member>
          </DAO>
        )}
        getId={(stake: StakeData) => `Stake: ${stake.id}`}
      />
    ))
    .add("Tokens", () => (
      <ComponentListView
        name={"Tokens"}
        ComponentListType={Tokens}
        ComponentType={Token}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        getId={(token: TokenData) =>
          `Token (${token.name} - ${token.symbol}): ${token.address}`
        }
      />
    ))
    .add("Votes", () => (
      <ComponentListView
        name={"Votes"}
        ComponentListType={Votes}
        ComponentType={Vote}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        scopes={[
          { name: "DAO", prop: DAOProp },
          { name: "Member as voter", prop: MemberProp },
          { name: "Proposal", prop: ProposalProp },
        ]}
        ScopeContext={(props) => (
          <DAO address={props.dao}>
            <Member address={props.member}>
              <Proposal id={props.proposal}>{props.children}</Proposal>
            </Member>
          </DAO>
        )}
        getId={(vote: VoteData) => `Vote: ${vote.id}`}
      />
    ))
    .add("Plugin with custom loader", () => (
      <ComponentListView
        name={"Plugin"}
        ComponentListType={Plugin}
        ComponentType={Plugin}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        ScopeContext={(props) => (
          <Loader
            render={(props: LoadingRenderProps) => (
              <div>
                {props.errors.length > 0
                  ? props.errors.map((error) => error)
                  : "Loading without errors"}
              </div>
            )}
          >
            {props.children}
          </Loader>
        )}
        getId={(scheme: PluginData) => `Plugin (${scheme.name}): ${scheme.id}`}
      />
    ));
