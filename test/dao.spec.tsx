import React from "react";
import {
  Arc,
  ArcConfig,
  DAO,
  DAOData,
  DAOs,
  Members,
  Member,
  MemberData,
} from "../src";
import { render, screen, cleanup } from "@testing-library/react";

const daoAddress = "0x218f6e4257bc3e932936e476ebaf45bb7c5c6485";
const arcConfig = new ArcConfig("private");

describe("DAO Component ", () => {
  afterEach(() => cleanup());

  it("Shows DAO ID", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <DAO address={daoAddress}>
          <DAO.Data>
            {(dao: DAOData) => <div>{"DAO address: " + dao.id}</div>}
          </DAO.Data>
        </DAO>
      </Arc>
    );
    const name = await screen.findByText(/DAO address:/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        DAO address: ${daoAddress}
      </div>
    `);
  });
});

describe("DAO List", () => {
  afterEach(() => cleanup());

  class DAOList extends React.Component {
    render() {
      return (
        <Arc config={arcConfig}>
          DAOS
          <DAOs>
            <DAO.Data>
              {(dao: DAOData) => <div>{"DAO address: " + dao.id}</div>}
            </DAO.Data>
          </DAOs>
        </Arc>
      );
    }
  }

  it("Show list of DAOS ", async () => {
    const { findAllByText } = render(<DAOList />);
    const daos = await findAllByText(/DAO address:/);
    expect(daos.length).toBeGreaterThan(1);
  });

  it("List DAO with members", async () => {
    class DAOWithMembers extends React.Component {
      render() {
        return (
          <Arc config={arcConfig}>
            DAOS
            <DAO address={daoAddress}>
              <DAO.Data>
                {(dao: DAOData) => <div>{"DAO address: " + dao.id}</div>}
              </DAO.Data>
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
    const { findAllByText } = render(<DAOWithMembers />);
    const members = await findAllByText(/Member address:/);
    expect(members.length).toBeGreaterThan(1);
  });
});
