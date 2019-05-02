import * as React from "react";
import Popup from 'reactjs-popup'
import {
  ObjectInspector,
  ObjectRootLabel,
  ObjectLabel
} from "react-inspector";
//import { ComponentLogs } from "../../src";

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

const Spinner = require("react-spinkit");

export default class LoadingView extends React.Component<any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    const {values } = this.props;

    return (
      <Popup
        trigger={<Spinner name='double-bounce'/>}
        position="right center"
        on="hover"
      >
        <div>
          {objectInspector(values.react, `${name}.ReactLogs`, "React Logs")}
          {objectInspector(values.entity, `${name}.EntityLogs`, "Entity Logs")}
          {objectInspector(values.data, `${name}.DataLogs`, "Data Query Logs")}
          {objectInspector(values.prose, `${name}.ProseLogs`, "Prose Logs")}
          {objectInspector(values.code, `${name}.CodeLogs`, "Code Logs")}
        </div>
      </Popup>
    )
  }
}
