import React = require("react");
import { create } from "react-test-renderer";
import { DAO } from "../src";

test("Say my name, say my name...", () => {
  const tree = create(
    <DAO address="Visitor" />
  ).toJSON();
  expect(tree).toMatchSnapshot();
})
