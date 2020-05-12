import * as React from "react";
import { storiesOf } from "@storybook/react";
import ComponentView, { PropertyType } from "../helpers/ComponentView";
import {
  Arc,
  ArcConfig,
  DAO,
  Member,
  Reputation,
  Token,
  Reward,
  Stake,
  Vote,
  Tag,
  Queue,
  Loader,
  LoadingRenderProps,
  Proposal,
  Plugin,
} from "../../src";

const arcConfig = new ArcConfig("private");

export default () =>
  storiesOf("Components", module)
    .add("DAO", () => (
      <ComponentView
        name={"DAO"}
        ComponentType={DAO}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        // TODO: add helper button to "Get DAO Addresses"
        propEditors={[
          {
            friendlyName: "DAO Address",
            name: "address",
            defaultValue: "0x28d0cff49cc653632b91ef61ccb1b2cde7b952a9",
            type: PropertyType.string,
          },
        ]}
      />
    ))
    .add("DAO with custom loader", () => (
      <ComponentView
        name={"DAO"}
        ComponentType={DAO}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        AddedContext={(props) => (
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
        // TODO: add helper button to "Get DAO Addresses"
        propEditors={[
          {
            friendlyName: "DAO Address",
            name: "address",
            defaultValue: "0x28d0cff49cc653632b91ef61ccb1b2cde7b952a9",
            type: PropertyType.string,
          },
        ]}
      />
    ))
    .add("Member", () => (
      <ComponentView
        name={"Member"}
        ComponentType={Member}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        AddedContext={(props) => (
          <DAO address={props.dao}>{props.children}</DAO>
        )}
        propEditors={[
          {
            friendlyName: "DAO Address",
            name: "dao",
            defaultValue: "0x28d0cff49cc653632b91ef61ccb1b2cde7b952a9",
            type: PropertyType.string,
          },
          {
            friendlyName: "Member Address",
            name: "address",
            defaultValue: "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
            type: PropertyType.string,
          },
        ]}
      />
    ))
    .add("Proposal", () => (
      <ComponentView
        name={"Proposal"}
        ComponentType={Proposal}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        propEditors={[
          {
            friendlyName: "Proposal ID",
            name: "id",
            defaultValue:
              "0x02fd1079f9a842581eb742ea44507a461466b791c2990783732bfe660aa6a711",
            type: PropertyType.string,
          },
        ]}
      />
    ))
    // TODO: single editor for Reputation & Token
    .add("Reputation", () => (
      <ComponentView
        name={"Reputation"}
        ComponentType={Reputation}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        propEditors={[
          {
            friendlyName: "Reputation Address",
            name: "address",
            defaultValue: "0x93cdbf39fb9e13bd253ca5819247d52fbabf0f2f",
            type: PropertyType.string,
          },
        ]}
      />
    ))
    .add("DAO Reputation", () => (
      <ComponentView
        name={"Reputation"}
        ComponentType={Reputation}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        AddedContext={(props) => (
          <DAO address={props.dao}>{props.children}</DAO>
        )}
        propEditors={[
          {
            friendlyName: "DAO Address",
            name: "dao",
            defaultValue: "0x28d0cff49cc653632b91ef61ccb1b2cde7b952a9",
            type: PropertyType.string,
          },
        ]}
      />
    ))
    .add("Reward", () => (
      <ComponentView
        name={"Reward"}
        ComponentType={Reward}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        propEditors={[
          {
            friendlyName: "Reward ID",
            name: "id",
            defaultValue:
              "0x0cb9948676fa48ea01b8bb0aada44ebd3b298d50e618ec823cfab456e42c71c2",
            type: PropertyType.string,
          },
        ]}
      />
    ))
    .add("Plugin", () => (
      <ComponentView
        name={"Plugin"}
        ComponentType={Plugin}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        propEditors={[
          {
            friendlyName: "Plugin ID",
            name: "id",
            defaultValue:
              "0x940f04d8fd1caca273cf05f1735362936280181684bc426f09cfba0265db47e4",
            type: PropertyType.string,
          },
        ]}
      />
    ))
    .add("Stake", () => (
      <ComponentView
        name={"Stake"}
        ComponentType={Stake}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        propEditors={[
          {
            friendlyName: "Stake ID",
            name: "id",
            defaultValue:
              "0x3d6b71c0fa97d433642c45b0b2f9642e0c79d0258ad4ff4dce667222dc15f526",
            type: PropertyType.string,
          },
        ]}
      />
    ))
    .add("Token", () => (
      <ComponentView
        name={"Token"}
        ComponentType={Token}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        propEditors={[
          {
            friendlyName: "Token Address",
            name: "address",
            defaultValue: "0x24014c20291afc04145a0bf5b5cdf58dc3f3b809",
            type: PropertyType.string,
          },
        ]}
      />
    ))
    .add("DAO Token", () => (
      <ComponentView
        name={"Token"}
        ComponentType={Token}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        AddedContext={(props) => (
          <DAO address={props.dao}>{props.children}</DAO>
        )}
        propEditors={[
          {
            friendlyName: "DAO Address",
            name: "dao",
            defaultValue: "0x28d0cff49cc653632b91ef61ccb1b2cde7b952a9",
            type: PropertyType.string,
          },
        ]}
      />
    ))
    .add("Vote", () => (
      <ComponentView
        name={"Vote"}
        ComponentType={Vote}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        propEditors={[
          {
            friendlyName: "Vote ID",
            name: "id",
            defaultValue:
              "0x33472fe4769ad20fbb6e14d28074d0f21e7e0a34b09edd2b841714575c5e0da6",
            type: PropertyType.string,
          },
        ]}
      />
    ))
    .add("Tag", () => (
      <ComponentView
        name={"Tag"}
        ComponentType={Tag}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        propEditors={[
          {
            friendlyName: "Tag ID",
            name: "id",
            defaultValue:
              "0x33472fe4769ad20fbb6e14d28074d0f21e7e0a34b09edd2b841714575c5e0da6",
            type: PropertyType.string,
          },
        ]}
      />
    ))
    .add("Queue", () => (
      <ComponentView
        name={"Queue"}
        ComponentType={Queue}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        AddedContext={(props) => (
          <DAO address={props.dao}>{props.children}</DAO>
        )}
        propEditors={[
          {
            friendlyName: "DAO Address",
            name: "dao",
            defaultValue: "0x666a6eb4618d0438511c8206df4d5b142837eb0d",
            type: PropertyType.string,
          },
          {
            friendlyName: "Queue ID",
            name: "id",
            defaultValue:
              "0x01224dc8c109c350accfa915fde36a28017ca894ee2144396bd7f0861b6b0d56",
            type: PropertyType.string,
          },
        ]}
      />
    ));
