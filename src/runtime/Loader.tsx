import React, { Component } from "react";

export type RenderFunc = ((props: RenderProps) => JSX.Element) | undefined;

export interface RenderProps {
  errors: React.ReactNode[];
}

interface Props {
  render: RenderFunc;
}

export class Loader extends Component<Props> {
  private static _RenderContext = React.createContext<RenderFunc>(undefined);

  public static get Render() {
    return Loader._RenderContext.Consumer;
  }

  public render() {
    const LoaderProvider = Loader._RenderContext.Provider;
    const loader = this.props.render;
    return (
      <LoaderProvider value={loader}>{this.props.children}</LoaderProvider>
    );
  }
}
