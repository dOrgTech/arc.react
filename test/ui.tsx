import React = require("react");
import { create } from "react-test-renderer";
import { Container as DAO } from "../src/containers/DAO";

test("Test...", () => {
  const tree = create(
    <DAO address="Visitor" />
  ).toJSON();
  expect(tree).toMatchSnapshot();
})
