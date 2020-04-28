import React from "react";
import {
  Arc,
  DevArcConfig as arcConfig,
  TokenData,
  Token,
  DAO,
  Tokens,
} from "../src";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";

const daoAddress = "0xe7a2c59e134ee81d4035ae6db2254f79308e334f";
describe("Token component ", () => {
  it("Shows token address", async () => {
    const tokenAddress = "0xcdbe8b52a6c60a5f101d4a0f1f049f19a9e1d35f";
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
