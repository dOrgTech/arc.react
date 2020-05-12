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

const daoAddress = "0x666a6eb4618d0438511c8206df4d5b142837eb0d";
const memberAddress = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1";
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
