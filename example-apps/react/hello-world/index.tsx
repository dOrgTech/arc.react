import * as React from "react"
import { init, Proposal } from "@DAOcomponents/react-containers"

class HelloWorld implements React.Component {
  public render() {
    return (
      <Proposal
        config={ protocol: DAOproto.Arc, address: "0x" }
        options={ scheme: "SomeScheme" }
      >
        ({ state = { pending, mined, voteOngoing, voteFinish } }) => (
          <div>
            id
          </div>
        )
      </Proposal>
    )
  }
}

// init web3  
// init library  
// init dao protocol + address  
// render HelloWorld
