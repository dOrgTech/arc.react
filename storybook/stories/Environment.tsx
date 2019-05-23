import * as React from "react";
import { storiesOf } from "@storybook/react";
import { setupGraphiQL } from "@storybook/addon-graphql";
import QuerySnippets from "../helpers/QuerySnippets";
import {
  Arc,
  ArcConfig,
  DefaultArcConfig } from "../../src";
import {
  Typography,
  Divider
} from '@material-ui/core';
import * as R from "ramda";
import ObjectInspector from "../helpers/ObjectInspector";

// TODO: make configurable
const defaultAddress = "0x0000000000000000000000000000000000000000"
const graphiql = setupGraphiQL({ url: "http://127.0.0.1:8000/subgraphs/name/daostack" });

export default () =>
  storiesOf("Environment", module)
    .add("Connections", () => {
      return (
        <Arc config={DefaultArcConfig}>
          <Arc.Config>
            {(arc: ArcConfig) => {
              return (
                <div>
                  <Typography variant="h6" component="h6">
                    Connection Status
                  </Typography>
                  {ObjectInspector(arc.connection, "arc.connection", "Connection Status")}
                </div>
              )
            }}
          </Arc.Config>
        </Arc>
      )})
    .add("Contracts", () => (
      <Arc config={DefaultArcConfig}>
        <Arc.Config>
          {(arc: ArcConfig) => {
            let render: Array<any> = []
            arc.connection.setAccount(defaultAddress)
            R.forEachObjIndexed( (value: any, key: any) => {
              try {
                let contract = arc.connection.getContract(key)
                let methods = {}
                R.forEachObjIndexed((value: any, key: any) => {
                  if (/[a-b]*\(/.test(key)) methods[key] = value
                }, contract.methods)
                contract.methods = methods
                render.push({'key': key, 'contract': contract})
              } catch (e) {
                console.log(e.message)
              }
            }, arc.connection.contractAddresses)

            return (
              <div>
                <Typography variant="h4" component="h4">
                  Contract txMethods, viewMethods and properties
                </Typography>
                <Divider />
                {render.map(o => {
                  return (
                    <>
                      <Typography variant="subtitle1" component="h6">
                        {`${o['key']} Contract: ${o['contract']._address}`}
                      </Typography>
                      {ObjectInspector(o['contract'].methods, `${o['key']}Contract.methods`, `${o['key']} Contract Methods`)}
                    </>
                  )
                })}
              </div>
            )
          }}
        </Arc.Config>
      </Arc>
    ))
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
