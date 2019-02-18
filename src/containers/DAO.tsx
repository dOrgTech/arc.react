import * as React from "react";
import * as Arc from "@daostack/client";
import { arc } from "../lib";
import Subscribe, { IObservableState } from "./Subscribe";

interface Props {
  address: string;
  // TODO: loading component override
}

export const DAO: React.SFC<Props> = ({ address }) => (
  <Subscribe observable={arc.dao(address).state}>
  {
    (state: IObservableState<Arc.IDAOState>): any => {
      if (state.isLoading) {
        return <div>loading</div>
      } else if (state.error) {
        return <div>{state.error.message}</div>
      } else if (state.data) {
        return <div>{state.data.address}</div>
      } else {
        return <div>null</div>
      }
    }
  }
  </Subscribe>
)

// TODO: optimization - [hash props] => object instance
// // what happens when data changes? will data change? what data?
