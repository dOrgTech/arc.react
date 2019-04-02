import * as React from "react";
import * as R from "ramda";

export interface BaseProps {
}

export class BaseComponent<Props extends BaseProps, State>
  extends React.Component<Props, State>
{
  protected mergeState(merge: any, callback: (()=>void) | undefined = undefined) {
    this.setState(
      R.mergeDeepRight(this.state, merge),
      callback
    );
  }
}
