import * as React from "react";
import { storiesOf } from "@storybook/react";
import { setupGraphiQL } from "@storybook/addon-graphql";
import QuerySnippets from "../helpers/QuerySnippets";
import { Arc, ArcConfig } from "../../src";
import { Typography, Divider } from "@material-ui/core";
import ObjectInspector from "../helpers/ObjectInspector";
import { IContractInfo, LATEST_ARC_VERSION } from "@daostack/arc.js";

const arcConfig = new ArcConfig("private");

// TODO: make configurable
const defaultAddress = "0x0000000000000000000000000000000000000000";
const graphiql = setupGraphiQL({
  url: arcConfig.connection.graphqlHttpProvider,
});

export default () =>
  storiesOf("Environment", module)
    .add("Connections", () => {
      return (
        <Arc config={arcConfig}>
          <Arc.Config>
            {(arc: ArcConfig) => {
              return (
                <div>
                  <Typography variant="h6" component="h6">
                    Connection Status
                  </Typography>
                  {ObjectInspector(
                    arc.connection,
                    "arc.connection",
                    "Connection Status"
                  )}
                </div>
              );
            }}
          </Arc.Config>
        </Arc>
      );
    })
    .add("Contracts", () => (
      <Arc config={arcConfig}>
        <Arc.Config>
          {(arc: ArcConfig) => {
            const connection = arc.connection;
            connection.setAccount(defaultAddress);

            return (
              <div>
                <Typography variant="h4" component="h4">
                  Contract txMethods, viewMethods and properties
                </Typography>
                <Divider />
                {connection.contractInfos.map((contractInfo: IContractInfo) => {
                  const { name, address, version } = contractInfo;
                  const abi = connection.getContract(address);

                  // Filter out all methods hex signatures
                  const methods = Object.keys(abi.methods)
                    .filter((key) => /[a-b]*\(/.test(key))
                    .reduce((obj, key) => {
                      obj[key] = abi.methods[key];
                      return obj;
                    }, {});

                  return (
                    <>
                      <Typography variant="subtitle1" component="h6">
                        {`Name: ${name} Version: ${LATEST_ARC_VERSION} Address: ${address}`}
                      </Typography>
                      {ObjectInspector(
                        methods,
                        `${name}Contract.methods`,
                        `${name} Contract Methods`
                      )}
                    </>
                  );
                })}
              </div>
            );
          }}
        </Arc.Config>
      </Arc>
    ))
    .add(
      "The Graph",
      graphiql(
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
      )
    )
    .add("Useful Queries", () => <QuerySnippets />);
