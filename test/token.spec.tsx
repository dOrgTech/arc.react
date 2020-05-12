import React from "react";
import { Arc, ArcConfig, TokenData, Token, DAO, Tokens } from "../src";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
  cleanup,
} from "@testing-library/react";

const arcConfig = new ArcConfig("private");
const daoAddress = "0x666a6eb4618d0438511c8206df4d5b142837eb0d";
const tokenAddress = "0x24014c20291afc04145a0bf5b5cdf58dc3f3b809";

describe("Token component ", () => {
  afterEach(() => cleanup());

  it("Shows token address", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <Token address={tokenAddress}>
          <Token.Data>
            {(token: TokenData) => (
              <div>{"Token address: " + token.address}</div>
            )}
          </Token.Data>
        </Token>
      </Arc>
    );

    const address = await screen.findByText(/Token address:/);
    expect(address).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Token address: ${tokenAddress}
      </div>
    `);
  });

  it("Shows DAO token address with inferred props", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <DAO address={daoAddress}>
          <Token>
            <Token.Data>
              {(token: TokenData) => (
                <div>{"Token DAO owner: " + token.owner}</div>
              )}
            </Token.Data>
          </Token>
        </DAO>
      </Arc>
    );

    const dao = await screen.findByText(/Token DAO owner:/);
    expect(dao).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Token DAO owner: ${daoAddress}
      </div>
    `);
  });
});

describe("Token List", () => {
  afterEach(() => cleanup());

  class TokenList extends React.Component {
    render() {
      return (
        <Arc config={arcConfig}>
          Tokens
          <Tokens>
            <Token.Data>
              {(token: TokenData) => (
                <div>{"Token address: " + token.address}</div>
              )}
            </Token.Data>
          </Tokens>
        </Arc>
      );
    }
  }

  it("Show list of token ", async () => {
    const { findAllByText, queryAllByTestId, findByText } = render(
      <TokenList />
    );
    await waitFor(() => findByText(/Token address/), {
      timeout: 8000,
    });
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 8000,
    });
    const tokens = await findAllByText(/Token address:/);
    expect(tokens.length).toBeGreaterThan(1);
  });
});
