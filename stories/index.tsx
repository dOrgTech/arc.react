import * as React from "react";
import { SampleWidget } from "../src";

import { storiesOf } from "@storybook/react";

storiesOf("Containers", module)
  .add("Sample Widget", () => <SampleWidget name="Visitor" />);

storiesOf("Views", module)
  .add("Sample Widget", () => <SampleWidget name="Visitor" />);
