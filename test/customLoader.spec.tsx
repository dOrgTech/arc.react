import React from "react";
import {
  Arc,
  ArcConfig,
  DAO,
  Loader,
  LoadingRenderProps,
  DAOData,
} from "../src";
import { render, screen, cleanup } from "@testing-library/react";

describe("Custom loader ", () => {
  afterEach(() => cleanup());

  const arcConfig = new ArcConfig("private");

  it("Shows custom message", async () => {
    const daoAddress = "0xe7a2c59e134ee81d4035ae6db2254f79308e334f";
    const { container } = render(
      <Loader
        render={(props: LoadingRenderProps) => (
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
              {(dao: DAOData) => <div>{"DAO name: " + dao.name}</div>}
            </DAO.Data>
          </DAO>
        </Arc>
      </Loader>
    );

    const loader = await screen.findByText("Loading without errors");
    expect(loader).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Loading without errors
      </div>
    `);
  });

  it("Shows error", async () => {
    const { container } = render(
      <Loader
        render={(props: LoadingRenderProps) => (
          <div>
            {props.errors.length > 0
              ? props.errors.map((error) => error)
              : "Loading without errors"}
          </div>
        )}
      >
        <Arc config={arcConfig}>
          <DAO address={"non existent id"}>
            <DAO.Data>
              {(dao: DAOData) => <div>{"Name: " + dao.name}</div>}
            </DAO.Data>
          </DAO>
        </Arc>
      </Loader>
    );

    const error = await screen.findByText(/Could not find a DAO with id/);
    expect(error).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Could not find a DAO with id non existent id
      </div>
    `);
  });
});
