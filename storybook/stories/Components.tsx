import * as React from "react";
import { storiesOf } from "@storybook/react";
import ComponentView, { PropertyType } from "../helpers/ComponentView";
import DAO, { DAOData, DAOEntity, DAOCode, ComponentLogs } from "../../src/components/DAO";

export default () => 
  storiesOf("Components", module)
    .add("DAO", () => {
      return (
        <ComponentView
          name={ "DAO" }
          Component={ DAO }
          // TODO: load these addresses from the graphnode
          propEditors={[
            {
              friendlyName: "DAO Address",
              name: "address",
              defaultValue: "0xcB4e66eCA663FDB61818d52A152601cA6aFEf74F",
              type: PropertyType.string
            }
          ]} />
      )
    })
    .add("DAO Test", () => (
      <DAO address={"0xcB4e66eCA663FDB61818d52A152601cA6aFEf74F"}>
        <DAO.Data>
          {(data: DAOData | undefined) => (
            data ?
            <div>{data.name}</div>
            : <div>loading...</div>
          )}
        </DAO.Data>
      </DAO>
    ))
    .add("DAO Test2", () => (
      <DAO address={"0xcB4e66eCA663FDB61818d52A152601cA6aFEf74F"}>
        {(entity: DAOEntity, data: DAOData, code: DAOCode, logs: ComponentLogs) => (
          entity && data && logs ?
            <>
            <div>{entity.address}</div>
            <div>{data.memberCount}</div>
            <div>{JSON.stringify(logs.entity)}</div>
            </>
          : <div>loading...</div>
        )}
      </DAO>
    ));
