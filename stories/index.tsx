import * as React from "react";
import { DAO } from "../src";

import { storiesOf } from "@storybook/react";

storiesOf("Containers", module)
  .add("Sample Widget", () => <DAO address="Visitor" />);

storiesOf("Views", module)
  .add("Sample Widget", () => <DAO address="Visitor" />);
