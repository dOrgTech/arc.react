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
        Component={DAO}
        RequiredContext={(props) => (
          <Arc config={arcConfig}>{props.children}</Arc>
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
    .add("DAO with custom loader", () => (
      <ComponentView
        name={"DAO"}
        Component={DAO}
        RequiredContext={(props) => (
          <Loader
            render={(props: RenderProps) => (
              <div>
                {props.errors.length > 0
                  ? props.errors.map((error) => error)
                  : "Loading without errors"}
              </div>
            )}
          >
            <Arc config={arcConfig}>{props.children}</Arc>
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
        Component={Member}
        RequiredContext={(props) => (
          <Arc config={arcConfig}>
            <DAO address={props.dao}>{props.children}</DAO>
          </Arc>
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
        Component={Proposal}
        RequiredContext={(props) => (
          <Arc config={arcConfig}>
            <DAO address={props.dao}>{props.children}</DAO>
          </Arc>
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
    .add("Reputation", () => (
      <ComponentView
        name={"Reputation"}
        Component={Reputation}
        RequiredContext={(props) => (
          <Arc config={arcConfig}>{props.children}</Arc>
        )}
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
        Component={Reputation}
        RequiredContext={(props) => (
          <Arc config={arcConfig}>
            <DAO address={props.dao}>{props.children}</DAO>
          </Arc>
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
        Component={Reward}
        RequiredContext={(props) => (
          <Arc config={arcConfig}>{props.children}</Arc>
        )}
        propEditors={[
          {
            friendlyName: "Reward ID",
            name: "id",
            defaultValue:
              "0xc0c911eafd30e6bb1f1f2b4a8cf401bf355a5e066a3af50e8ef7b09dd68e65db",
            type: PropertyType.string,
          },
        ]}
      />
    ))
    .add("Scheme", () => (
      <ComponentView
        name={"Scheme"}
        Component={Scheme}
        RequiredContext={(props) => (
          <Arc config={arcConfig}>{props.children}</Arc>
        )}
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
        Component={Stake}
        RequiredContext={(props) => (
          <Arc config={arcConfig}>{props.children}</Arc>
        )}
        propEditors={[
          {
            friendlyName: "Stake ID",
            name: "id",
            defaultValue:
              "0xb6398a75633d9af9928ae4fe6c0db4105e52514bd0321a77ca6ae7a8d5e60971",
            type: PropertyType.string,
          },
        ]}
      />
    ))
    .add("Token", () => (
      <ComponentView
        name={"Token"}
        Component={Token}
        RequiredContext={(props) => (
          <Arc config={arcConfig}>{props.children}</Arc>
        )}
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
        Component={Token}
        RequiredContext={(props) => (
          <Arc config={arcConfig}>
            <DAO address={props.dao}>{props.children}</DAO>
          </Arc>
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
        Component={Vote}
        RequiredContext={(props) => (
          <Arc config={arcConfig}>{props.children}</Arc>
        )}
        propEditors={[
          {
            friendlyName: "Vote ID",
            name: "id",
            defaultValue:
              "0x2f3637f7d77d6b1ca3412e30bb9764f82267458b4f4e320a297a8ac9889e8160",
            type: PropertyType.string,
          },
        ]}
      />
    ));
