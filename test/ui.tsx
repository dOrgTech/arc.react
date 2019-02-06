import React = require("react");
import { create } from "react-test-renderer";
import { SampleWidget } from "../src";

test("Say my name, say my name...", () => {
  const tree = create(
    <SampleWidget name="Visitor" />
  ).toJSON();
  expect(tree).toMatchSnapshot();
})
