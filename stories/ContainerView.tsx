import * as React from "react";
import { ObjectInspector } from "react-inspector";

interface Props {
  name: string,
  Type: any,
  props?: any
}

export default class ContainerView extends React.Component<Props> {
  public render() {
    const { name, Type, props } = this.props;

    return (
      <Type.Container {...props}>
        <Type.Status>
          {(status: any) => {
            if (status.isLoading) {
              return <div>loading</div>
            } else if (status.error) {
              return <div>{status.error.message}</div>
            } else {
              // TODO: null case?
              return (
                <Type.Graph>
                  {(graph: any) => (
                    <>
                      <ObjectInspector data={graph} name={`${name}.Graph`} expandLevel={1} />
                      <ObjectInspector data={status} name={`${name}.Status`} expandLevel={1} />
                    </>
                  )}
                </Type.Graph>
              );
            }
          }}
        </Type.Status>
      </Type.Container>
    )
  }
}

// TODO: if function is the child, then render it with everything
// TODO: why is status "loaded" false?
