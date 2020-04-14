import React, { Component } from "react";

interface Props {
  render: JSX.Element | undefined;
}
export const LoaderContext = React.createContext(undefined);

export class Loader extends Component<Props> {
  public state = {
    render: undefined,
  };

  public componentDidMount() {
    console.log(this.props.render);
    if (this.props.render) {
      this.setState({ render: this.props.render });
    }
  }

  public static get Render() {
    return LoaderContext.Consumer;
  }

  public render() {
    const { render } = this.state;
    return (
      <LoaderContext.Provider value={render}>
        {this.props.children}
      </LoaderContext.Provider>
    );
  }
}
