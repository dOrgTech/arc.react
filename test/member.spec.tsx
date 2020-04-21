import React from "react";
import {
  Arc,
  DevArcConfig as arcConfig,
  DAO,
  MemberData,
  Member,
  DAOData,
} from "../src";
import { render, screen } from "@testing-library/react";

describe("Member component ", () => {
  it("Shows member and dao address with inferred props", async () => {
    const daoAddress = "0xe7a2c59e134ee81d4035ae6db2254f79308e334f";
    const memberAddress = "0xe11ba2b4d45eaed5996cd0823791e0c93114882d";
    const { container } = render(
      <Arc config={arcConfig}>
        <DAO address={daoAddress}>
          <Member address={memberAddress}>
            <DAO.Data>
              <Member.Data>
                {(dao: DAOData, member: MemberData) => (
                  <>
                    <div>{"Member address: " + member.address}</div>
                    <div>{"DAO address: " + dao.id}</div>
                  </>
                )}
              </Member.Data>
            </DAO.Data>
          </Member>
        </DAO>
      </Arc>
    );

    const member = await screen.findByText(/Member address:/);
    const dao = await screen.findByText(/DAO address:/);
    expect(member).toBeInTheDocument();
    expect(dao).toBeInTheDocument();
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div>
          Member address: ${memberAddress}
        </div>
        <div>
          DAO address: ${daoAddress}
        </div>
      </div>
    `);
  });

  /* 
  This doesn't works because Member component just accept the members address
  props, so this might change (?)

  it("Shows member and dao address without inferred props", async () => {
    const daoAddress = "0xe7a2c59e134ee81d4035ae6db2254f79308e334f";
    const memberAddress = "0xe11ba2b4d45eaed5996cd0823791e0c93114882d";
    const { container } = render(
      <Arc config={arcConfig}>
        <Member address={memberAddress} daoAddress={daoAddress}>
          <DAO.Data>
            <Member.Data>
              {(dao: DAOData, member: MemberData) => (
                <>
                  <div>{"Member address: " + member.address}</div>
                  <div>{"DAO address: " + dao.id}</div>
                </>
              )}
            </Member.Data>
          </DAO.Data>
        </Member>
      </Arc>
    );

    const member = await screen.findByText(/Member address:/);
    const dao = await screen.findByText(/DAO address:/);
    expect(member).toBeInTheDocument();
    expect(dao).toBeInTheDocument();
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div>
          Member address: ${memberAddress}
        </div>
        <div>
          DAO address: ${daoAddress}
        </div>
      </div>
    `);
  }); 
  */
});
