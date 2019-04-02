import * as React from "react";
import * as R from "ramda";
import { LoggingConfig } from "./";
import { DefaultLoggingConfig } from "./configs/LoggingConfig";

export interface BaseProps {
  // TODO: move this to a static getter model, don't like having this
  // where we have to feed in the context feed everywhere... too much bloat.
  // Global logging config isn't so bad.
  loggingConfig?: LoggingConfig;
}

export class BaseComponent<Props extends BaseProps, State>
  extends React.Component<Props, State>
{
  protected get LoggingConfig(): LoggingConfig {
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
