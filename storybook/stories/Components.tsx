import * as React from "react";
import { storiesOf } from "@storybook/react";
import ComponentView, { PropertyType } from "../helpers/ComponentView";
import {
  Arc,
  DefaultArcConfig,
  DAO,
  Member,
  Proposal
} from "../../src";

export default () => 
  storiesOf("Components", module)
    .add("DAO", () => {
      return (
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
      )
    })
    .add("Member", () => {
      return (
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
      )
    })
    .add("Proposal", () => {
      return (
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
      )
    });
