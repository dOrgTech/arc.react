import React from "react";
import { render, findByText, fireEvent } from "@testing-library/react";
import {
  Arc,
  DevArcConfig as arcConfig,
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
    const badConfig = new ArcConfig(
      arcConfig.web3HttpUrl,
      "wrong url",
      arcConfig.graphqlWsUrl,
      arcConfig.ipfsProvider,
      arcConfig.network
    );
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
    const arcConnectionError = await findByText(
      container,
      /Error: Network error: only absolute urls are supported/
    );
    expect(arcConnectionError).toBeInTheDocument();
  });

  // it("ComponentList shows error", async () => {
  //   const { findByTestId, container } = render(
  //     <Arc config={arcConfig}>
  //       <Members>
  //         <Member.Data>
  //           {(member: MemberData) => (
  //             <div>{"Member address: " + member.address}</div>
  //           )}
  //         </Member.Data>
  //       </Members>
  //     </Arc>
  //   );
  //   const loader = await findByTestId("default-loader");
  //   fireEvent.mouseEnter(loader);
  //   const daoAddressError = await findByText(container, /DAO Missing/);
  //   expect(daoAddressError).toBeInTheDocument();
  // });
});
