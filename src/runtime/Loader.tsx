import React, { Component } from "react";

export type LoadingRenderFunc =
  | ((props: LoadingRenderProps) => JSX.Element)
  | undefined;

export interface LoadingRenderProps {
  errors: React.ReactNode[];
}

interface Props {
  render: LoadingRenderFunc;
}

export class Loader extends Component<Props> {
  private static _RenderContext = React.createContext<LoadingRenderFunc>(
    undefined
  );

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
