import * as React from "react";
import { storiesOf } from "@storybook/react";
import DAOs from "../../src/components/DAOs";
import DAO from "../../src/components/DAO";

export default () =>
  storiesOf("Component Lists", module)
    .add("DAOs", () => {
      return (
        <DAOs>
        {() => {
          console.log("HERE WHERE WE WANT TO BE");
          return (
          <DAO.Data>
          {(data: any | undefined) => (
            <>
            {data ? (
              <div>{data.name}</div>
            ) : (
              <div>loading...</div>
            )}
            </>
          )}
          </DAO.Data>
          )
        }}
        </DAOs>
      )
    });
