import * as React from "react";
import { storiesOf } from "@storybook/react";
import ContainerView from "../helpers/ContainerView";
import DAO from "../../src/containers/DAO";

export default () => 
  storiesOf("Components", module)
    .add("DAO", () =>
      <ContainerView 
        name={ "DAO" }
        Type={ DAO }
        // TODO: load these addresses from the graphnode
        props={{ address: "0xcB4e66eCA663FDB61818d52A152601cA6aFEf74F" }} />
    );
