import * as React from "react";
import { storiesOf } from "@storybook/react";
import ComponentView, { PropertyType } from "../helpers/ComponentView";
import {
  Arc,
  ArcConfig,
  DAO,
  Member,
  Proposal,
  Reputation,
  Token,
  Reward,
  Scheme,
  Stake,
  Vote,
  Loader,
  RenderProps,
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
            defaultValue: "0xe7a2c59e134ee81d4035ae6db2254f79308e334f",
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
            render={(props: RenderProps) => (
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
            defaultValue: "0xe7a2c59e134ee81d4035ae6db2254f79308e334f",
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
            defaultValue: "0xe7a2c59e134ee81d4035ae6db2254f79308e334f",
            type: PropertyType.string,
          },
          {
            friendlyName: "Member Address",
            name: "address",
            defaultValue: "0xe11ba2b4d45eaed5996cd0823791e0c93114882d",
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
        AddedContext={(props) => (
          <DAO address={props.dao}>{props.children}</DAO>
        )}
        propEditors={[
          {
            friendlyName: "Proposal ID",
            name: "id",
            defaultValue:
              "0x6afee092a28c74f6358093d5376ac75014ac4d9fd42d296a5498ef42eecd7248",
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
            defaultValue: "0xe7a2c59e134ee81d4035ae6db2254f79308e334f",
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
    .add("Scheme", () => (
      <ComponentView
        name={"Scheme"}
        ComponentType={Scheme}
        ProtocolType={Arc}
        protocolConfig={arcConfig}
        propEditors={[
          {
            friendlyName: "Scheme ID",
            name: "id",
            defaultValue:
              "0xe60210db33d48ffc3ba89a0a220500fa8f1a55ed0b4bf28bf7821b23a022cc28",
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
            defaultValue: "0xcdbe8b52a6c60a5f101d4a0f1f049f19a9e1d35f",
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
            defaultValue: "0xe7a2c59e134ee81d4035ae6db2254f79308e334f",
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
              "0x0795aafa7207e2c48241fa432f1f66789e0d2a2e2802208ced7ca3ff216dc74e",
            type: PropertyType.string,
          },
        ]}
      />
    ));
