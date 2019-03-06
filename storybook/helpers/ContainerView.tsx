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
    const { name, Type, props, children } = this.props;

    return (
      <Type {...props}>
        <Type.Query>
          {(query: any) => {
            if (query.isLoading) {
              return <div>loading</div>
            } else if (query.error) {
              return <div>{query.error.message}</div>
            } else {
              return (
                <Type.Data>
                  {(data: any) => {
                    if (data && query) {
                      return (
                        <>
                          {objectInspector(data, `${name}.Data`, "Semantic Data")}
                          {objectInspector(query, `${name}.Query`, "GraphQL Query Diagnostics")}
                          {children}
                        </>
                      )
                    } else {
                      return <div>null</div>
                    }
                  }}
                </Type.Data>
              );
            }
          }}
        </Type.Query>
      </Type>
    )
  }
}

// TODO: if function is the child, then render it with everything
// TODO: why is status "loaded" false?
