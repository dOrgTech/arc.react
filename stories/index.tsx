import * as React from "react";
import { storiesOf } from "@storybook/react";
import ContainerView from "./ContainerView";

// Containers
import {
  DAO, DAOContext
} from "../src/containers";

storiesOf("Event Graph", module)
  .add("Query", () => <text>TODO: query editor</text>);

storiesOf("Containers", module)
  .add("DAO", () => 
    <ContainerView 
      name={ "DAO" }
      Container={ DAO }
      Context={ DAOContext }
      props={{ address: "0xcB4e66eCA663FDB61818d52A152601cA6aFEf74F" }} />
  );

storiesOf("Views", module)
  .add("TODO", () => <text>TODO: sample DAO view</text>);
