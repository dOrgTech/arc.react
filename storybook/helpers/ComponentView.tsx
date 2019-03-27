import * as React from "react";
import {
  ObjectInspector,
  ObjectRootLabel,
  ObjectLabel
} from "react-inspector";
import {
  CircularProgress,
  Typography,
  Divider
} from '@material-ui/core';

import { ComponentLogs } from "../lib/Component";
import { PropertyEditors, PropertyData, PropertyType } from "./PropertyEditors";
export { PropertyData, PropertyType };

interface Props {
  name: string;
  Component: any;
  propEditors: PropertyData[];
}

interface State {
  [name: string]: any
}

export default class ComponentView extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    let newState: {[name: string]: any} = { };

    props.propEditors.forEach(editor => {
      newState[editor.name] = editor.defaultValue;
    });

    this.state = newState;
  }

  public render() {
    const { name, Component, propEditors } = this.props;

    return (
      <>
      <Typography variant="h3" component="h3">
        {name}
      </Typography>
      <Divider />
      <Typography variant="h6" component="h6">
        Properties
      </Typography>
      <PropertyEditors properties={propEditors} state={this.state} setState={(state) => this.setState(state)} />
      <Component {...this.state}>
        <Typography variant="h6" component="h6">
          Entity
        </Typography>
        <Component.Entity>
          {(entity: any | undefined) => (
            <>
            {entity ? (
              <>
              {objectInspector(entity, `${name}.Entity`, "Entity Instance")}
              </>
            ) : (
              <div>
                <CircularProgress />
              </div>
            )}
            </>
          )}
        </Component.Entity>
        <Typography variant="h6" component="h6">
          Data
        </Typography>
        <Component.Data>
          {(data: any | undefined) => (
            <>
            {data ? (
              <>
              {objectInspector(data, `${name}.Data`, "Semantic Data")}
              </>
            ) : (
              <div>
                <CircularProgress />
              </div>
            )}
            </>
          )}
        </Component.Data>
        <Typography variant="h6" component="h6">
          Logs
        </Typography>
        <Component.Logs>
          {(logs: ComponentLogs) => (
            <>
            {objectInspector(logs.react, `${name}.ReactLogs`, "React Logs")}
            {objectInspector(logs.entity, `${name}.EntityLogs`, "Entity Logs")}
            {objectInspector(logs.data, `${name}.DataLogs`, "Data Query Logs")}
            {objectInspector(logs.code, `${name}.CodeLogs`, "Code Logs")}
            {objectInspector(logs.prose, `${name}.ProseLogs`, "Prose Logs")}
            </>
          )}
        </Component.Logs>
      </Component>
      </>
    )
  }
}

const objectInspector = (data: any, name: string, tooltip: string) => {
  return (
    <ObjectInspector
      data={{...data}}
      name={name}
      expandLevel={1}
      theme={"chromeDark"}
      nodeRenderer={(node: any) => nodeRenderer(node, tooltip)} />
  );
}

const nodeRenderer = (node: any, tooltip: string) => {
  const { depth, name, data, isNonenumerable } = node;

  return (
    depth === 0
      ? <ObjectRootLabel name={name} data={tooltip} />
      : <ObjectLabel name={name} data={data} isNonenumerable={isNonenumerable} />
  );
}
