import * as React from "react";
import { storiesOf } from "@storybook/react";
import { setupGraphiQL } from "@storybook/addon-graphql";
import QuerySnippets from "../helpers/QuerySnippets";

// TODO: make configurable
const graphiql = setupGraphiQL({ url: "http://127.0.0.1:8000/subgraphs/name/daostack" });

export default () =>
  storiesOf("Debugging", module)
    .add("Connections", () => <text>TODO: connection statuses (eth_node, contracts, graph_node)</text>)
    .add("Contracts", () => <text>TODO: contracts deployed</text>)
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
