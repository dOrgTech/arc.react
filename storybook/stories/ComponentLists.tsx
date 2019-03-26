import * as React from "react";
import { storiesOf } from "@storybook/react";
import DAOs from "../../src/components/DAOs";
import DAO, { DAOData, DAOEntity } from "../../src/components/DAO";
import Members from "../../src/components/Members";
import { Member, MemberData } from "../../src/components/Member";

export default () =>
  storiesOf("Component Lists", module)
    .add("DAOs", () => {
      return (
        <DAOs>
          <div>something useful</div>
          <DAO.Data>
          {(data: DAOData | undefined) => (
            data ?
              <>
              <div>{data.name}</div>
              <div>{data.address}</div>
              <div>{data.memberCount}</div>
              </>
            : <div>loading...</div>
          )}
          </DAO.Data>
          <Members>
            <Member.Data>
            {(data: MemberData | undefined) => (
              data ?
              <>
              <div>{data.address}</div>
              <div>{data.tokens.toString()}</div>
              <div>{data.reputation.toString()}</div>
              </>
              : <div>loading...</div>
            )}
            </Member.Data>
          </Members>
        </DAOs>
      )
    })
    .add("DAO Entities", () => {
      return (
        <DAOs>
          {(entities: DAOEntity[]) => (
            entities ?
            <>
              {entities.map((entity, index) => (
                <React.Fragment key={index}>
                <div>{entity.address}</div>
                </React.Fragment>
              ))}
            </>
            : <div>loading...</div>
          )}
        </DAOs>
      )
    });
