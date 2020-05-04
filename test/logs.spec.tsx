import React from "react";
import {
  render,
  findByText,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import {
  Arc,
  ArcConfig,
  Token,
  TokenData,
  Tokens,
  Members,
  Member,
  MemberData,
  DAO,
  networkSettings,
} from "../src";

describe("Components with logs ", () => {
  afterEach(() => cleanup());

  it("Protocol shows error", async () => {
    const badConfig = new ArcConfig({
      ...networkSettings.private,
      graphqlHttpProvider: "wrong url",
    });
    const { findByTestId, container } = render(
      <Arc config={badConfig}>
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
    const arcConnectionError = await findByText(container, /Connecting/);
    expect(arcConnectionError).toBeInTheDocument();
  });

  it("ComponentList shows error without arc", async () => {
    const MemberList = (
      <DAO address={""}>
        <Members>
          <Member.Data>
            {(member: MemberData) => (
              <div>{"Member address: " + member.address}</div>
            )}
          </Member.Data>
        </Members>
      </DAO>
    );
    const { findByTestId, container } = render(MemberList);
    const loader = await findByTestId("default-loader");
    fireEvent.mouseEnter(loader);
    const daoAddressError = await findByText(container, /Arc Entity not found/);
    expect(daoAddressError).toBeInTheDocument();
  });

  // TODO: @cesar when I test this manually it works, but it isn't working in the automated tests...
  // unsure what could be changed to fix...
  it.skip("ComponentList shows error without when missing entity", async () => {
    const config = new ArcConfig("private");

    const MemberList = (
      <Arc config={config}>
        <Members from="DAO">
          <Member.Data>
            {(member: MemberData) => (
              <div>{"Member address: " + member.address}</div>
            )}
          </Member.Data>
        </Members>
      </Arc>
    );

    const { findByTestId, findByText } = render(MemberList);
    const loader = await findByTestId("default-loader");
    fireEvent.mouseEnter(loader);
    await waitFor(() => findByText(/DAO Entity not found/), {
      timeout: 8000,
    });
    const daoAddressError = await findByText(/DAO Entity not found/);
    expect(daoAddressError).toBeInTheDocument();
  });
});
