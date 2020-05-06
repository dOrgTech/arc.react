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
  defaultValue: "0xe7a2c59e134ee81d4035ae6db2254f79308e334f",
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
    "0x6afee092a28c74f6358093d5376ac75014ac4d9fd42d296a5498ef42eecd7248",
  type: PropertyType.string,
};

const TokenProp: PropertyData = {
  friendlyName: "Token Address",
  name: "token",
  defaultValue: "0x81920caf1f99bb0f7d72fdfba840cff21d63ccc5",
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
    // .add("Rewards", () => (
    //   <ComponentListView
    //     name={"Rewards"}
    //     ComponentListType={Rewards}
    //     ComponentType={Reward}
    //     ProtocolType={Arc}
    //     protocolConfig={arcConfig}
    //     scopes={[
    //       { name: "DAO", prop: DAOProp },
    //       { name: "Member as beneficiary", prop: MemberProp },
    //       { name: "Proposal", prop: ProposalProp },
    //       { name: "Token", prop: TokenProp },
    //     ]}
    //     ScopeContext={(props) => (
    //       <DAO address={props.dao}>
    //         <Member address={props.member}>
    //           <Proposal id={props.proposal}>
    //             <Token address={props.token}>{props.children}</Token>
    //           </Proposal>
    //         </Member>
    //       </DAO>
    //     )}
    //     getId={(reward: RewardData) => `Reward: ${reward.id}`}
    //   />
    // ))
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
    // .add("Stakes", () => (
    //   <ComponentListView
    //     name={"Stakes"}
    //     ComponentListType={Stakes}
    //     ComponentType={Stake}
    //     ProtocolType={Arc}
    //     protocolConfig={arcConfig}
    //     scopes={[
    //       { name: "DAO", prop: DAOProp },
    //       { name: "Member as staker", prop: MemberProp },
    //       { name: "Proposal", prop: ProposalProp },
    //     ]}
    //     ScopeContext={(props) => (
    //       <DAO address={props.dao}>
    //         <Member address={props.member}>
    //           <Proposal id={props.proposal}>{props.children}</Proposal>
    //         </Member>
    //       </DAO>
    //     )}
    //     getId={(stake: StakeData) => `Stake: ${stake.id}`}
    //   />
    // ))
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
    ));
// .add("Votes", () => (
//   <ComponentListView
//     name={"Votes"}
//     ComponentListType={Votes}
//     ComponentType={Vote}
//     ProtocolType={Arc}
//     protocolConfig={arcConfig}
//     scopes={[
//       { name: "DAO", prop: DAOProp },
//       { name: "Member as voter", prop: MemberProp },
//       { name: "Proposal", prop: ProposalProp },
//     ]}
//     ScopeContext={(props) => (
//       <DAO address={props.dao}>
//         <Member address={props.member}>
//           <Proposal id={props.proposal}>{props.children}</Proposal>
//         </Member>
//       </DAO>
//     )}
//     getId={(vote: VoteData) => `Vote: ${vote.id}`}
//   />
// ))
// .add("Plugin with custom loader", () => (
//   <ComponentListView
//     name={"Plugin"}
//     ComponentListType={Plugin}
//     ComponentType={Plugin}
//     ProtocolType={Arc}
//     protocolConfig={arcConfig}
//     ScopeContext={(props) => (
//       <Loader
//         render={(props: LoadingRenderProps) => (
//           <div>
//             {props.errors.length > 0
//               ? props.errors.map((error) => error)
//               : "Loading without errors"}
//           </div>
//         )}
//       >
//         {props.children}
//       </Loader>
//     )}
//     getId={(scheme: PluginData) => `Plugin (${scheme.name}): ${scheme.id}`}
//   />
// ));
// .add("Plugin with custom loader", () => (
//   <ComponentListView
//     name={"Plugin"}
//     ComponentList={Plugin}
//     Component={Plugin}
//     RequiredContext={(props) => (
//       <Loader
//         render={(props: RenderProps) => (
//           <div>
//             {props.errors.length > 0
//               ? props.errors.map((error) => error)
//               : "Loading without errors"}
//           </div>
//         )}
//       >
//         <Arc config={arcConfig}>{props.children}</Arc>
//       </Loader>
//     )}
//     propEditors={[]}
//     getId={(scheme: PluginData) => `Plugin (${scheme.name}): ${scheme.id}`}
//   />
// ));
