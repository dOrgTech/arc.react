import React from "react";
import {
  Arc,
  ArcConfig,
  DAO,
  MemberData,
  Member,
  DAOData,
  Members,
} from "../src";
import { render, screen, cleanup } from "@testing-library/react";

const daoAddress = "0xe7a2c59e134ee81d4035ae6db2254f79308e334f";
const memberAddress = "0xffcf8fdee72ac11b5c542428b35eef5769c409f0";
const arcConfig = new ArcConfig("private");

describe("Member component ", () => {
  afterEach(() => cleanup());

  it("Shows member and dao address with inferred props", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <DAO address={daoAddress}>
          <Member address={memberAddress}>
            <DAO.Data>
              <Member.Data>
                {(dao: DAOData, member: MemberData) => (
                  <>
                    <div>{"Member address: " + member.address}</div>
                    <div>{"DAO address: " + dao.address}</div>
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

  it("Shows member and dao address without inferred props", async () => {
    const { container, findByText } = render(
      <Arc config={arcConfig}>
        <Member address={memberAddress} dao={daoAddress}>
          <Member.Data>
            {(member: MemberData) => (
              <>
                <div>{"Member address: " + member.address}</div>
                <div>{"DAO address: " + member.dao.id}</div>
              </>
            )}
          </Member.Data>
        </Member>
      </Arc>
    );
    const member = await findByText(/Member address:/);
    const dao = await findByText(/DAO address:/);
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
});

describe("Member List", () => {
  afterEach(() => cleanup());

  class MemberList extends React.Component {
    render() {
      return (
        <Arc config={arcConfig}>
          Members
          <DAO address={daoAddress}>
            <Members>
              <Member.Data>
                {(member: MemberData) => (
                  <div>{"Member address: " + member.address}</div>
                )}
              </Member.Data>
            </Members>
          </DAO>
        </Arc>
      );
    }
  }

  it("Show list of member ", async () => {
    const { findAllByText } = render(<MemberList />);
    const members = await findAllByText(/Member address:/);
    expect(members.length).toBeGreaterThan(1);
  });
});
