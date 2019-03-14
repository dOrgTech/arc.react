import * as React from "react";
import { storiesOf } from "@storybook/react";
import DAOs from "../../src/components/DAOs";
import DAO, { DAOData } from "../../src/components/DAO";

export default () =>
  storiesOf("Component Lists", module)
    .add("DAOs", () => {
      return (
        <DAOs>
          <div>something useful</div>
          <DAO.Data>
          {(data: DAOData | undefined) => (
            <>
            {data ? (
              <>
              <div>{data.name}</div>
              <div>{data.address}</div>
              <div>{data.memberCount}</div>
              </>
            ) : (
              <div>loading...</div>
            )}
            </>
          )}
          </DAO.Data>
        </DAOs>
      )
    });
