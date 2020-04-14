import React from "react";
import { create } from "react-test-renderer";
import { Arc, DevArcConfig as arcConfig, DAO } from "../src";

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
