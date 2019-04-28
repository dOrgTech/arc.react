import * as React from "react";
import { storiesOf } from "@storybook/react";
import ComponentView, { PropertyType } from "../helpers/ComponentView";
import {
  Arc,
  DefaultArcConfig,
  DAO,
  DAOData,
  DAOCode,
  DAOEntity,
  Member,
  MemberData,
  ComponentLogs
} from "../../src";

export default () => 
  storiesOf("Components", module)
    .add("DAO", () => {
      return (
        <ComponentView
          name={"DAO"}
          Component={DAO}
          Protocol={Arc}
          config={DefaultArcConfig}
          // TODO: add helper button to "Get DAO Addresses"
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
      <>
      <Arc config={DefaultArcConfig}>
        <DAO address={"0xcB4e66eCA663FDB61818d52A152601cA6aFEf74F"}>
          <DAO.Data>
          {(data: DAOData | undefined) => (
            data ?
            <div>{data.name}</div>
            : <div>loading...</div>
          )}
          </DAO.Data>
          <Member address="0xcb4e66eca663fdb61818d52a152601ca6afef74f">
            <Member.Data>
            {(data: MemberData | undefined) => (
              data ?
              <div>{data.reputation.toString()}</div>
              : <div>loading...</div>
            )}
            </Member.Data>
          </Member>
        </DAO>
      </Arc>
      </>
    ))
    .add("DAO Test2", () => (
      <>
      <Arc config={DefaultArcConfig}>
        <DAO address={"0xcB4e66eCA663FDB61818d52A152601cA6aFEf74F"}>
          {(entity: DAOEntity, data: DAOData, code: DAOCode, logs: ComponentLogs) => (
            entity && data && logs ?
              <>
              <div>{entity.address}</div>
              <div>{data.memberCount}</div>
              <div>{JSON.stringify(logs)}</div>
              </>
            : <div>loading...</div>
          )}
        </DAO>
      </Arc>
      </>
    ))
    .add("Test", () => (
      <>
      <Arc config={DefaultArcConfig}>
        <DAO address={"0xcb4e66eca663fdb61818d52a152601ca6afef74f"}>
          <DAO.Entity>
          <DAO.Data>
          {(entity: DAOEntity, data: DAOData) => (
            <div>{data.name}</div>
          )}
          </DAO.Data>
          <DAO.Data>
          {(entity: DAOEntity, data: DAOData) => (
            <div>{data.address}</div>
          )}
          </DAO.Data>
          </DAO.Entity>
          <DAO.Data>
          <DAO.Entity>
          {(data: DAOData, entity: DAOEntity) => (
            <div>{data.tokenName}</div>
          )}
          </DAO.Entity>
          </DAO.Data>
        </DAO>
      </Arc>
      </>
    ));
