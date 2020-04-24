import React from "react";
import { Arc, DevArcConfig as arcConfig, DAO, DAOData, DAOs } from "../src";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  queryByText,
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
      timeout: 3000,
    });
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 4000,
    });
    const daos = await findAllByText(/DAO address:/);
    expect(daos.length).toBeGreaterThan(1);
  });
});
