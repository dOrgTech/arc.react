import * as React from "react";
import { storiesOf } from "@storybook/react";
import ComponentView, { PropertyType } from "../helpers/ComponentView";
import {
  Arc,
  DefaultArcConfig,
  DAO,
  Member,
  Proposal,
  Reputation,
  Token,
  Reward
} from "../../src";

export default () =>
  storiesOf("Components", module)
    .add("DAO", () => (
      <ComponentView
        name={"DAO"}
        Component={DAO}
        RequiredContext={(props) => (
          <Arc config={DefaultArcConfig}>
          {props.children}
          </Arc>
        )}
        // TODO: add helper button to "Get DAO Addresses"
        propEditors={[
          {
            friendlyName: "DAO Address",
            name: "address",
            defaultValue: "0xe7a2c59e134ee81d4035ae6db2254f79308e334f",
            type: PropertyType.string
          }
        ]}
      />
    ))
    .add("Member", () => (
      <ComponentView
        name={"Member"}
        Component={Member}
        RequiredContext={(props) => (
          <Arc config={DefaultArcConfig}>
            <DAO address={props.dao}>
            {props.children}
            </DAO>
          </Arc>
        )}
        propEditors={[
          {
            friendlyName: "DAO Address",
            name: "dao",
            defaultValue: "0xe7a2c59e134ee81d4035ae6db2254f79308e334f",
            type: PropertyType.string
          },
          {
            friendlyName: "Member Address",
            name: "address",
            defaultValue: "0xe11ba2b4d45eaed5996cd0823791e0c93114882d",
            type: PropertyType.string
          }
        ]}
      />
    ))
    .add("Proposal", () => (
      <ComponentView
        name={"Proposal"}
        Component={Proposal}
        RequiredContext={(props) => (
          <Arc config={DefaultArcConfig}>
            <DAO address={props.dao}>
            {props.children}
            </DAO>
          </Arc>
        )}
        propEditors={[
          {
            friendlyName: "DAO Address",
            name: "dao",
            defaultValue: "0xe7a2c59e134ee81d4035ae6db2254f79308e334f",
            type: PropertyType.string
          },
          {
            friendlyName: "Proposal ID",
            name: "id",
            defaultValue: "0x6afee092a28c74f6358093d5376ac75014ac4d9fd42d296a5498ef42eecd7248",
            type: PropertyType.string
          }
        ]}
      />
    ))
    .add("Reputation", () => (
      <ComponentView
        name={"Reputation"}
        Component={Reputation}
        RequiredContext={(props) => (
          <Arc config={DefaultArcConfig}>
            {props.children}
          </Arc>
        )}
        propEditors={[
          {
            friendlyName: "Reputation Address",
            name: "address",
            defaultValue: "0x93cdbf39fb9e13bd253ca5819247d52fbabf0f2f",
            type: PropertyType.string
          }
        ]}
      />
    ))
    .add("DAO Reputation", () => (
      <ComponentView
        name={"Reputation"}
        Component={Reputation}
        RequiredContext={(props) => (
          <Arc config={DefaultArcConfig}>
            <DAO address={props.dao}>
            {props.children}
            </DAO>
          </Arc>
        )}
        propEditors={[
          {
            friendlyName: "DAO Address",
            name: "dao",
            defaultValue: "0xe7a2c59e134ee81d4035ae6db2254f79308e334f",
            type: PropertyType.string
          }
        ]}
      />
    ))
    .add("Token", () => (
      <ComponentView
        name={"Token"}
        Component={Token}
        RequiredContext={(props) => (
          <Arc config={DefaultArcConfig}>
            {props.children}
          </Arc>
        )}
        propEditors={[
          {
            friendlyName: "Token Address",
            name: "address",
            defaultValue: "0xcdbe8b52a6c60a5f101d4a0f1f049f19a9e1d35f",
            type: PropertyType.string
          }
        ]}
      />
    ))
    .add("DAO Token", () => (
      <ComponentView
        name={"Token"}
        Component={Token}
        RequiredContext={(props) => (
          <Arc config={DefaultArcConfig}>
            <DAO address={props.dao}>
            {props.children}
            </DAO>
          </Arc>
        )}
        propEditors={[
          {
            friendlyName: "DAO Address",
            name: "dao",
            defaultValue: "0xe7a2c59e134ee81d4035ae6db2254f79308e334f",
            type: PropertyType.string
          }
        ]}
      />
    ))
    .add("Reward", () => (
      <ComponentView
        name={"Reward"}
        Component={Reward}
        RequiredContext={(props) => (
          <Arc config={DefaultArcConfig}>
            {props.children}
          </Arc>
        )}
        propEditors={[
          {
            friendlyName: "Reward ID",
            name: "id",
            defaultValue: "0x679ee37af4f2e69b5c13d0827b873aaf5c6bbea03fe95e27751916e2571e8aea",
            type: PropertyType.string
          }
        ]}
      />
    ));
