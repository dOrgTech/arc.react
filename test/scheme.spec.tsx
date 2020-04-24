import React from "react";
import {
  Arc,
  DevArcConfig as arcConfig,
  SchemeData,
  Scheme,
  Schemes,
} from "../src";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";

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

describe("Scheme List", () => {
  class SchemeList extends React.Component {
    render() {
      return (
        <Arc config={arcConfig}>
          Schemes
          <Schemes>
            <Scheme.Data>
              {(scheme: SchemeData) => <div>{"Scheme id: " + scheme.id}</div>}
            </Scheme.Data>
          </Schemes>
        </Arc>
      );
    }
  }

  it("Show list of scheme ", async () => {
    const { findAllByText, queryAllByTestId, findByText } = render(
      <SchemeList />
    );
    await waitFor(() => findByText(/Scheme id:/), {
      timeout: 3000,
    });
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 5000,
    });
    const schemes = await findAllByText(/Scheme id:/);
    expect(schemes.length).toBeGreaterThan(1);
  });
});
