import * as React from "react";
import { DAO } from "../src";

import { storiesOf } from "@storybook/react";

storiesOf("Event Graph", module)
  .add("Query", () => <text>TODO: query editor</text>);

storiesOf("Containers", module)
  .add("DAO", () => <DAO address="0xcB4e66eCA663FDB61818d52A152601cA6aFEf74F" />);

storiesOf("Views", module)
  .add("TODO", () => <text>TODO: sample DAO view</text>);
