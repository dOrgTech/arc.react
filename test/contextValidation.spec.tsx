import React from "react";
import { create } from "react-test-renderer";
import {
  Arc,
  DevArcConfig as arcConfig,
  DAO,
  Loader,
  LoaderProps,
} from "../src";

describe("DAO component renders", () => {
  it("Component renders", async () => {
    const arc = await create(
      <Arc config={arcConfig}>
        <DAO address="0x">
          <DAO.Data />
        </DAO>
      </Arc>
    );
    expect(arc.root.findByType(DAO).props.address).toBe("0x");
  });
});

describe("Custom loader works", () => {
  let loader: any;
  beforeAll(async () => {
    loader = await create(
      <Loader
        render={(props: LoaderProps) => (
          <div>
            {props.errors.length > 0
              ? props.errors.map((error) => error)
              : "Loading without errors"}
          </div>
        )}
      >
        <Arc config={arcConfig}>
          <DAO address="0x">
            <DAO.Data />
          </DAO>
        </Arc>
      </Loader>
    );
  });

  it("Loading component without error", () => {
    const loaderRoot = loader.root;
    const errors: Array<null> = [];
    const loadingDiv = loaderRoot.props.render({ errors }).props.children;
    expect(loadingDiv).toEqual("Loading without errors");
  });

  it("Loading component with error", () => {
    const loaderRoot = loader.root;
    const errors: Array<string> = ["Cannot connect to blockchain"];
    const errorDiv = loaderRoot.props.render({ errors }).props.children;
    expect(errorDiv).toEqual(["Cannot connect to blockchain"]);
  });
});
