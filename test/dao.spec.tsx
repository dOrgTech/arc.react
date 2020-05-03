import React from "react";
import { Arc, ArcConfig, DAO, Loader, RenderProps, DAOData } from "../src";
import { render, screen } from "@testing-library/react";

describe("Custom loader ", () => {
  const arcConfig = new ArcConfig("private");

  it("Shows DAO ID", async () => {
    const daoAddress = "0xe7a2c59e134ee81d4035ae6db2254f79308e334f";
    const { container } = render(
      <Loader
        render={(props: RenderProps) => (
          <div>
            {props.errors.length > 0
              ? props.errors.map((error) => error)
              : "Loading without errors"}
          </div>
        )}
      >
        <Arc config={arcConfig}>
          <DAO address={daoAddress}>
            <DAO.Data>
              {(dao: DAOData) => <div>{"DAO address: " + dao.id}</div>}
            </DAO.Data>
          </DAO>
        </Arc>
      </Loader>
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
