import React from "react";
import {
  render,
  screen,
  cleanup,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import {
  Arc,
  ArcConfig,
  DAO,
  MemberData,
  Member,
  DAOData,
  Members,
  useMember,
} from "../src";

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

  it("Shows address using useMember", async () => {
    const MemberWithHooks = () => {
      const [memberData] = useMember();
      return (
        <>
          <div>{"Member address: " + memberData?.address}</div>
          <div>{"DAO address: " + memberData?.dao.id}</div>
        </>
      );
    };
    const { container, findByText } = render(
      <Arc config={arcConfig}>
        <Member address={memberAddress} dao={daoAddress}>
          <MemberWithHooks />
        </Member>
      </Arc>
    );

    const name = await findByText(/Member address:/);
    expect(name).toBeInTheDocument();
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
    const { findAllByText, queryAllByTestId } = render(<MemberList />);
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 8000,
    });
    const members = await findAllByText(/Member address:/);
    expect(members.length).toBeGreaterThan(1);
  });
});
