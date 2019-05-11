import * as React from "react";
import { storiesOf } from "@storybook/react";
import ComponentView, { PropertyType } from "../helpers/ComponentView";
import {
  Arc,
  DefaultArcConfig,
  DAO,
  Member,
  Proposal,
  Reputation
} from "../../src";

// TODO: remove
import {
  DAOData,
  MemberData
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
        ]} />
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
        ]} />
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
        ]} />
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
        ]} />
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
        ]} />
    ))
    .add("Test", () => (
      <Arc config={DefaultArcConfig}>
        <DAO address={"0xe7a2c59e134ee81d4035ae6db2254f79308e334f"}>
          <DAO.Data>
          {(data: DAOData) => (
            <>
            <div>{data.address}</div>
            <div>{data.name}</div>
            </>
          )}
          </DAO.Data>
          <Member address={"0xe11ba2b4d45eaed5996cd0823791e0c93114882d"}>
          <Member address={"0x22d491bde2303f2f43325b2108d26f1eaba1e32b"}>
          <Member.Data>
          {(data: MemberData) => (
            <>
            <div>{data.address}</div>
            <div>{data.reputation.toString()}</div>
            </>
          )}
          </Member.Data>
          </Member>
          </Member>
        </DAO>
      </Arc>
    ));

// 0xe7a2c59e134ee81d4035ae6db2254f79308e334f
// "Nefarious Soaper"
/// Members
//// 0xe11ba2b4d45eaed5996cd0823791e0c93114882d
//// 990000000000000000000
//// 0x22d491bde2303f2f43325b2108d26f1eaba1e32b
//// 980100000000000000000

// 0x86072cbff48da3c1f01824a6761a03f105bcc697
// "Turbulent Banjo"
/// Members
//// 0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc
//// 0x93b3bb6e8b75a6f4086a4e31cb744253c267b4a6ce83aadf6be37ddc9a3e872c
//// 1000000000000000000000
//// 0xd03ea8624c8c5987235048901fb614fdca89b117
//// 0x900a00c6b9230204c3950a9c228a647f65d614f9d587ac4fad7bb382f4dc70c4
//// 1000000000000000000000
