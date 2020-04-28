import React from "react";
import {
  Arc,
  DevArcConfig as arcConfig,
  DAO,
  DAOData,
  DAOs,
  Members,
  Member,
  MemberData,
} from "../src";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";

const daoAddress = "0xe7a2c59e134ee81d4035ae6db2254f79308e334f";

describe("DAO Component ", () => {
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
    const { findAllByText, queryAllByTestId, findByText } = render(<DAOList />);
    await waitFor(() => findByText(/DAO address:/), {
      timeout: 8000,
    });
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 8000,
    });
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
              <Members inferred={true}>
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
    const { findAllByText, queryAllByTestId, findByText } = render(
      <DAOWithMembers />
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
