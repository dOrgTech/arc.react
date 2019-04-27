// Idea Usage
// <DAO address={"something"}>
//   <DAO.Data spinner={() => (<spinner size={20}></spinner>)}>
//   {data => (<div>{data.name}</div>)}
//   </DAO.Data>
// </DAO>

// TODO:
// - get consumer
// - if null, render spinner
// - if !null, render children w/ value

import * as React from "react";

export interface FeedProps extends React.PropsWithChildren<{}> {
  prop?: any
}

function isFeedProps(object: any): object is FeedProps {
  return "prop" in object;
}

export interface Props {
  consumer: any
  // TODO: type for runtime type checking
}

export class ContextFeed extends React.Component<Props>
{
  constructor(props: Props) {
    super(props);
  }

  render() {
    if (!this.props.children || !this.props.children[0]) {
       throw Error("Fuck off")
    }

    if (isFeedProps(this.props.children[0].props)) {

    }

    return (
      <div>

      </div>
    );
  }
}
