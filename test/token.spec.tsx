import React from "react";
import {
  Arc,
  ArcConfig,
  TokenData,
  Token,
  DAO,
  Tokens,
  useToken,
} from "../src";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
  cleanup,
} from "@testing-library/react";

const arcConfig = new ArcConfig("private");
const daoAddress = "0x41e5eb4acf9d65e4ac220e9afdccba0213cf60ec";
const tokenAddress = "0x02b0028ecc7053e9972d258942e680ad94821aa3";

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

  it("Shows address using useToken", async () => {
    const TokenWithHooks = () => {
      const [tokenData] = useToken();
      return <div>{"Token address: " + tokenData?.address}</div>;
    };
    const { container, findByText } = render(
      <Arc config={arcConfig}>
        <Token address={tokenAddress}>
          <TokenWithHooks />
        </Token>
      </Arc>
    );

    const name = await findByText(`Token address: ${tokenAddress}`);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Token address: ${tokenAddress}
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
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 8000,
    });
    await waitFor(() => findByText(`Token address: ${tokenAddress}`), {
      timeout: 8000,
    });
    const tokens = await findAllByText(/Token address:/);
    expect(tokens.length).toBeGreaterThan(1);
  });
});
