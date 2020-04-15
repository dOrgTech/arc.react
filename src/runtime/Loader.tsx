import React, { Component } from "react";

export type LoaderProps = { errors: React.ReactNode[] };
export type customLoader =
  | React.ComponentClass<LoaderProps>
  | React.StatelessComponent<LoaderProps>;
interface Props {
  render: customLoader;
}
export class Loader extends Component<Props> {
  private static _LoaderContext = React.createContext<any>(undefined);

  public static get Render() {
    return Loader._LoaderContext.Consumer;
  }

  public render() {
    const LoaderProvider = Loader._LoaderContext.Provider;
    const loader = this.props.render;
    return (
      <LoaderProvider value={loader}>{this.props.children}</LoaderProvider>
    );
  }
}
