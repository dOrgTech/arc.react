import * as React from "react";
import { storiesOf } from "@storybook/react";
import ContainerView from "./ContainerView";

// Containers
import DAO from "../src/containers/DAO";

storiesOf("Environment", module)
  .add("Connections", () => <text>TODO: connection statuses (eth_node, contracts, graph_node)</text>)
  .add("Contracts", () => <text>TODO: contracts deployed</text>)
  .add("Graph Query", () => <text>TODO: query editor</text>);

storiesOf("Components", module)
  .add("DAO", () =>
    <ContainerView 
      name={ "DAO" }
      Type={ DAO }
      // TODO: have an application config that loads the DAO addresses from the migrations file
      props={{ address: "0xcB4e66eCA663FDB61818d52A152601cA6aFEf74F" }} />
  );

storiesOf("Example Views", module)
  .add("TODO", () => <text>TODO: sample DAO view</text>);

storiesOf("Example Apps", module)
  .add("TODO", () => <text>TODO: sample DAO app integrations</text>);
