import * as React from "react";
import { storiesOf } from "@storybook/react";
import { setupGraphiQL } from "@storybook/addon-graphql";
import QuerySnippets from "../helpers/QuerySnippets";
import {
  Arc,
  ArcConfig,
  DefaultArcConfig } from "../../src";
import {
  ObjectInspector,
  ObjectRootLabel,
  ObjectLabel
} from "react-inspector";
import {
  Typography,
} from '@material-ui/core';

const R = require('ramda')
const objectInspector = (data: any, name: string, tooltip: string) => {
  return (
    <ObjectInspector
      data={{...data}}
      name={name}
      expandLevel={1}
      theme={"chromeDark"}
      nodeRenderer={(node: any) => nodeRenderer(node, tooltip)} />
  );
}

const nodeRenderer = (node: any, tooltip: string) => {
  const { depth, name, data, isNonenumerable } = node;

  return (
    depth === 0
      ? <ObjectRootLabel name={name} data={tooltip} />
      : <ObjectLabel name={name} data={data} isNonenumerable={isNonenumerable} />
  );
}
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
                  {objectInspector(arc.connection, "arc.connection", "Connection Status")}
                </div>
              )
            }}
          </Arc.Config>
        </Arc>
      )})
    .add("Contracts", () => {
      return (
        <Arc config={DefaultArcConfig}>
          <Arc.Config>
            {(arc: ArcConfig) => {
              let render: Array<any> = []
              R.forEachObjIndexed( (value: any, key: any) => {
                arc.connection.setAccount(defaultAddress)
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
                  {render.map(o => {
                    return (
                      <>
                        <Typography variant="h6" component="h6">
                          {`${o['key']} Contract`}
                        </Typography>
                        {objectInspector(o['contract'].methods, `${o['key']}Contract.methods`, `${o['key']} Contract Methods`)}
                      </>
                    )
                  })}
                </div>
              )
            }}
          </Arc.Config>
        </Arc>
      )})
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
