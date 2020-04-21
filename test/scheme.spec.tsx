import React from "react";
import { Arc, DevArcConfig as arcConfig, SchemeData, Scheme } from "../src";
import { render, screen } from "@testing-library/react";

describe("Scheme component ", () => {
  it("Shows scheme name", async () => {
    const schemeId =
      "0xe60210db33d48ffc3ba89a0a220500fa8f1a55ed0b4bf28bf7821b23a022cc28";
    const { container } = render(
      <Arc config={arcConfig}>
        <Scheme id={schemeId}>
          <Scheme.Data>
            {(scheme: SchemeData) => <div>{"Scheme name: " + scheme.name}</div>}
          </Scheme.Data>
        </Scheme>
      </Arc>
    );

    const name = await screen.findByText(/Scheme name:/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Scheme name: SchemeRegistrar
      </div>
    `);
  });
});
