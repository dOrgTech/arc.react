import * as React from "react";
import { storiesOf } from "@storybook/react";
import ContainerView, { PropTypes } from "../helpers/ContainerView";
import DAO from "../../src/containers/DAO";

export default () => 
  storiesOf("Components", module)
    .add("DAO", () => {
      return (
        <ContainerView
          name={ "DAO" }
          Component={ DAO }
          // TODO: load these addresses from the graphnode
          propEditors={[
            {
              friendlyName: "DAO Address",
              name: "address",
              defaultValue: "0xcB4e66eCA663FDB61818d52A152601cA6aFEf74F",
              type: PropTypes.string
            }
          ]} />
      )
    });
