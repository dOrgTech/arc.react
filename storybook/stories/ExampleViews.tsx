import * as React from "react";
import { storiesOf } from "@storybook/react";

export default () =>
  storiesOf("Example Views", module)
    .add("TODO", () => <text>TODO: sample DAO view</text>);
