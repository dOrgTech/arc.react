import * as React from "react";
import { storiesOf } from "@storybook/react";
import { setupGraphiQL } from "@storybook/addon-graphql";
import QuerySnippets from "../helpers/QuerySnippets";

// TODO: make configurable
const graphiql = setupGraphiQL({ url: "http://127.0.0.1:8000/subgraphs/name/daostack" });

export default () =>
  storiesOf("Environment", module)
    .add("Connections", () => <div>TODO: connection statuses (eth_node, contracts, graph_node)</div>)
    .add("Contracts", () => <div>TODO: contracts deployed</div>)
    .add("The Graph", graphiql(
      `{
        daos {
          id
          name
          nativeReputation {
            id
          }
          nativeToken {
            id
          }
        }
      }`
    ))
    .add("Useful Queries", () =>
      <QuerySnippets />
    );
