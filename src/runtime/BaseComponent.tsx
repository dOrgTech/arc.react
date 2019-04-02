import * as React from "react";
import * as R from "ramda";
import { LoggingConfig } from "./";
import { DefaultLoggingConfig } from "./configs/LoggingConfig";

export interface BaseProps {
  loggingConfig?: LoggingConfig;
}

export class BaseComponent<Props extends BaseProps, State>
  extends React.Component<Props, State>
{
  protected get LoggingConfig(): LoggingConfig {
    // TODO: move this to a static getter model, don't like having this
    // where we have to feed in the context feed everywhere... too much bloat
    if (this.props.loggingConfig) {
      return this.props.loggingConfig as any;
    } else {
      return DefaultLoggingConfig;
    }
  }

  protected mergeState(merge: any, callback: (()=>void) | undefined = undefined) {
    this.setState(
      R.mergeDeepRight(this.state, merge),
      callback
    );
  }
}
