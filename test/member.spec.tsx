import React from "react";
import {
  Arc,
  ArcConfig,
  DAO,
  MemberData,
  Member,
  DAOMember,
  DAOData,
  DAOEntity,
  Members,
} from "../src";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";

const daoAddress = "0xe7a2c59e134ee81d4035ae6db2254f79308e334f";
const arcConfig = new ArcConfig("private");

describe("Member component ", () => {
  it("Shows member and dao address with inferred props", async () => {
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

  it("Shows member and dao address without inferred props", async () => {
    const daoAddress = "0xe7a2c59e134ee81d4035ae6db2254f79308e334f";
    const memberAddress = "0xe11ba2b4d45eaed5996cd0823791e0c93114882d";
    const { container, findByText } = render(
      <Arc config={arcConfig}>
        <DAOMember
          address={memberAddress}
          dao={new DAOEntity(arcConfig.connection, daoAddress)}
        >
          <Member.Data>
            {(member: MemberData) => (
              <>
                <div>{"Member address: " + member.address}</div>
                <div>{"DAO address: " + member.dao}</div>
              </>
            )}
          </Member.Data>
        </DAOMember>
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
    const { findAllByText, queryAllByTestId, findByText } = render(
      <MemberList />
    );
    await waitFor(() => findByText(/Member address:/), {
      timeout: 8000,
    });
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 8000,
    });
    const members = await findAllByText(/Member address:/);
    expect(members.length).toBeGreaterThan(1);
  });
});
