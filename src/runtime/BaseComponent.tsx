import * as React from "react";
import * as R from "ramda";
import { ProtocolConfig } from "./configs/ProtocolConfig";

type PropertyBag = { [propName: string]: any }

export interface BaseState {
  // TODO: might be able to have this as a property of the component, and could
  // cut down rerenders by 1
  // Properties inferred, used for the derived class
  inferredProps: PropertyBag;

  // TODO: get rid of
  protocolConfig?: ProtocolConfig;
}

export abstract class BaseComponent<Props, State extends BaseState> extends React.Component<Props, State>
{
  protected abstract gatherInferredProps(): React.ReactNode;

  protected mergeState(merge: any, callback: (()=>void) | undefined = undefined) {
    this.setState(
      R.mergeDeepRight(this.state, merge),
      callback
    );
  }

  // TODO: make sure this works
  protected setProp(name: string, value: any) {
    this.mergeState({ inferredProps: { [name]: value } });
  }

  // TODO: ensure this works
  protected mergeInferredProps(): Props {
    const mergedProps: PropertyBag = {};
    const inferredProps = this.state.inferredProps;

    // Add existing props
    Object.entries(this.props).map(entry =>
      mergedProps[entry[0]] = entry[1]
    );

    // Add inferred props
    for (const propName in inferredProps) {
      if (inferredProps[propName]) {
        mergedProps[propName] = inferredProps[propName]
      }
    }

    return mergedProps as Props;
  }
}
