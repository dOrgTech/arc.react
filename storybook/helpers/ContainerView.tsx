import * as React from "react";
import {
  ObjectInspector,
  ObjectRootLabel,
  ObjectLabel
} from "react-inspector";
import * as R from "ramda";
import { TextField } from "@material-ui/core";

export enum PropTypes {
  string,
  number
}

interface PropEditor {
  friendlyName: string;
  name: string;
  type: PropTypes;
  defaultValue: any;
  // TODO: dropdown -> possibleValues: any[]
}

interface Props {
  name: string;
  Component: any;
  propEditors: PropEditor[];
}

interface State {
  [name: string]: any
}

export default class ContainerView extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    let newState: {[name: string]: any} = { };

    props.propEditors.forEach(editor => {
      newState[editor.name] = editor.defaultValue;
    });

    this.state = newState;
  }

  handleChange = (name: string) => (event: any) => {
    this.setState(
      R.merge(this.state, {
        [name]: event.target.value
      })
    );
  }

  public render() {
    const { name, Component, propEditors, children } = this.props;

    return (
      <>
        {propEditors.map(prop => {
          // set the default value if it isn't already set
          if (this.state[prop.name] === undefined) {
            this.setState(
              R.merge(this.state, {
                [prop.name]: prop.defaultValue
              })
            );
          }

          // TODO get rid of this switch by having the caller
          // give render methods for their types (with args they want forwarded)
          switch (prop.type) {
            case PropTypes.string:
              return (
                <TextField
                  id={`prop-editor-${prop.name}`}
                  label={prop.friendlyName}
                  value={this.state[prop.name]}
                  onChange={this.handleChange(prop.name)}
                  />
              )
            break;
            case PropTypes.number:
              return (<></>)
            break;
            default:
              return (<></>)
            break;
          }
        })}
        <Component {...this.state}>
          <Component.Query>
            {(query: any) => {
              if (query.isLoading) {
                return <div>loading</div>
              } else if (query.error) {
                return <div>{query.error.message}</div>
              } else {
                return (
                  <Component.Data>
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
                  </Component.Data>
                );
              }
            }}
          </Component.Query>
        </Component>
      </>
    )
  }
}

const nodeRenderer = (node: any, tooltip: string) => {
  const { depth, name, data, isNonenumerable } = node;

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

// TODO: if function is the child, then render it with everything
// TODO: why is status "loaded" false?
