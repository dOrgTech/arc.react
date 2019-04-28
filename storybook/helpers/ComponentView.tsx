import * as React from "react";
import {
  ObjectInspector,
  ObjectRootLabel,
  ObjectLabel
} from "react-inspector";
import {
  Typography,
  Divider
} from '@material-ui/core';

import { ComponentLogs, ProtocolConfig } from "../../src";
import { PropertyEditors, PropertyData, PropertyType } from "./PropertyEditors";
export { PropertyData, PropertyType };

interface Props {
  name: string;
  Component: any;
  Protocol: any;
  config: ProtocolConfig;
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
    const { name, Component, Protocol, config, propEditors } = this.props;

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
      <Protocol config={config}>
        <Component {...this.state}>
          <Component.Entity>
          <Component.Data>
          <Component.Logs>
            {(entity: any, data: any, logs: ComponentLogs) => (
              <>
              <Typography variant="h6" component="h6">
                Entity
              </Typography>
              {objectInspector(entity, `${name}.Entity`, "Entity Instance")}
              <Typography variant="h6" component="h6">
                Data
              </Typography>
              {objectInspector(data, `${name}.Data`, "Semantic Data")}
              <Typography variant="h6" component="h6">
                Logs
              </Typography>
              {objectInspector(logs.react, `${name}.ReactLogs`, "React Logs")}
              {objectInspector(logs.entity, `${name}.EntityLogs`, "Entity Logs")}
              {objectInspector(logs.data, `${name}.DataLogs`, "Data Query Logs")}
              {objectInspector(logs.code, `${name}.CodeLogs`, "Code Logs")}
              {objectInspector(logs.prose, `${name}.ProseLogs`, "Prose Logs")}
              </>
            )}
          </Component.Logs>
          </Component.Data>
          </Component.Entity>
        </Component>
      </Protocol>
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
