import * as React from "react";
import {
  ObjectInspector,
  ObjectRootLabel,
  ObjectLabel
} from "react-inspector";

interface Props {
  name: string,
  Type: any,
  props?: any
}

const nodeRenderer = (node: any, tooltip: string) => {
  const { depth, name, data, isNonenumerable, expanded } = node;

  return (
    depth === 0
      ? <ObjectRootLabel name={name} data={tooltip} />
      : <ObjectLabel name={name} data={data} isNonenumerable={isNonenumerable} />
  );
}

const objectInspector = (data: any, name: string, tooltip: string) => {
  return (
    <ObjectInspector
    data={data}
    name={name}
    expandLevel={1}
    theme={"chromeDark"}
    nodeRenderer={(node: any) => nodeRenderer(node, tooltip)} />
  );
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
              return (
                <Type.Graph>
                  {(graph: any) => {
                    if (graph && status) {
                      return (
                        <>
                          {objectInspector(graph, `${name}.Graph`, "Semantic Graph")}
                          {objectInspector(status, `${name}.Status`, "bar")}
                        </>
                      )
                    } else {
                      return <div>null</div>
                    }
                  }}
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
