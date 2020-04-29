import React from "react";
import {
  render,
  findByText,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import {
  Arc,
  DevArcConfig as arcConfig,
  DAO,
  DAOData,
  Token,
  TokenData,
  Tokens,
  Members,
  Member,
  MemberData,
  ArcConfig,
} from "../src";

describe("Components with logs ", () => {
  it("Protocol shows error", async () => {
    const { findByTestId, container } = render(
      <Arc config={{ ...arcConfig, graphqlHttpUrl: "wrong url" } as ArcConfig}>
        <Tokens>
          <Token.Data>
            {(token: TokenData) => (
              <div>{"Token address: " + token.address}</div>
            )}
          </Token.Data>
        </Tokens>
      </Arc>
    );
    const loader = await findByTestId("default-loader");
    fireEvent.mouseEnter(loader);
    const arcConnectionError = await findByText(
      container,
      /No connection to the graph/
    );
    expect(arcConnectionError).toBeInTheDocument();
  });

  it("ComponentList shows error", async () => {
    class DAOWithMembers extends React.Component {
      render() {
        return (
          <Arc config={arcConfig}>
            <Members>
              <Member.Data>
                {(member: MemberData) => (
                  <div>{"Member address: " + member.address}</div>
                )}
              </Member.Data>
            </Members>
          </Arc>
        );
      }
    }
    const { findByTestId, container } = render(<DAOWithMembers />);
    const loader = await findByTestId("default-loader");
    fireEvent.mouseEnter(loader);
    const daoAddressError = await findByText(container, /DAO Entity Missing/);
    expect(daoAddressError).toBeInTheDocument();
  });
});
