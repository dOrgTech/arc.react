import * as React from "react";
import { storiesOf } from "@storybook/react";
import ContainerView from "./ContainerView";

// Containers
import * as DAO from "../src/containers/DAO";

storiesOf("Event Graph", module)
  .add("Query", () => <text>TODO: query editor</text>);

storiesOf("Containers", module)
  .add("TEST", () => (
    <DAO.Container address={"0xcB4e66eCA663FDB61818d52A152601cA6aFEf74F" }>
      <DAO.Graph>
        {dao => (
          <div>
            {dao.name}
          </div>
        )}
      </DAO.Graph>
    </DAO.Container>
  )
  )
  .add("DAO", () =>
    <ContainerView 
      name={ "DAO" }
      Type={ DAO }
      props={{ address: "0xcB4e66eCA663FDB61818d52A152601cA6aFEf74F" }} />
  );

storiesOf("Views", module)
  .add("TODO", () => <text>TODO: sample DAO view</text>);
