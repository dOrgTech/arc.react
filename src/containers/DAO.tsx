import * as React from "react";
import * as Arc from "@daostack/client";
import { arc } from "../lib";
import Subscribe, { IObservableState } from "./Subscribe";

interface Props {
  address: string;
  // TODO: loading component override
}

export const DAOContext = React.createContext({
  /* Arc.IDAOState */
} as Arc.IDAOState);

export const DAO: React.SFC<Props> = ({ address, children }) => (
  <Subscribe observable={arc.dao(address).state}>
  {
    (state: IObservableState<Arc.IDAOState>): any => {
      if (state.isLoading) {
        return <div>loading</div>
      } else if (state.error) {
        return <div>{state.error.message}</div>
      } else if (state.data) {
        return <DAOContext.Provider value={state.data}>{children}</DAOContext.Provider>
      } else {
        return <div>null</div>
      }
    }
  }
  </Subscribe>
)

// TODO: optimization - [hash props] => object instance
// // what happens when data changes? will data change? what data?
