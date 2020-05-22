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
  DAOData,
  DAOs,
  Members,
  Member,
  MemberData,
  useDAO,
} from "../src";

const daoAddress = "0x41e5eb4acf9d65e4ac220e9afdccba0213cf60ec";
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

  it("Shows address using useDAO", async () => {
    const DaoWithHooks = () => {
      const [daoData] = useDAO();
      return <div>{"DAO address: " + daoData?.id}</div>;
    };
    const { container, findByText } = render(
      <Arc config={arcConfig}>
        <DAO address={daoAddress}>
          <DaoWithHooks />
        </DAO>
      </Arc>
    );

    const name = await findByText(/DAO address:/);
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
    const { findAllByText, queryAllByTestId } = render(<DAOList />);
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
    const { findAllByText, queryAllByTestId } = render(<DAOWithMembers />);
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 8000,
    });
    const members = await findAllByText(/Member address:/);
    expect(members.length).toBeGreaterThan(1);
  });
});
