import React = require("react");
import { create } from "react-test-renderer";
import {
  DAOs,
  DAOEntity
} from "../src";

test("Nested Context: Same Type", () => {
  let daos = [];
  create(
    <DAOs>
    {(entities: DAOEntity[]) => {
      daos = entities;
    }}
    </DAOs>
  );
  console.log(daos.map(dao => dao.name));
})
