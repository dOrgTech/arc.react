import * as React from "react"
import { init, Proposal } from "@DAOcomponents/react-containers"

class HelloWorld implements React.Component {
  public render() {
    return (
      <Proposal>
        ({ graph /*events->graphql*/, views /*view methods*/, actions /*tx methods*/ }) => (
          <div>
            ${name}
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
