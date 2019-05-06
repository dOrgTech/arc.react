import * as React from "react";
import Popup from 'reactjs-popup'
import {
  ObjectInspector,
  ObjectRootLabel,
  ObjectLabel
} from "react-inspector";
import { ComponentLogs } from "../../src";
const _ = require('lodash')

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

interface Props {
  logs: ComponentLogs
}

export default class LoadingView extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const { logs } = this.props;

    let render: Array<any> = []
    _.forEach(logs, function (value: any, key: any) {
      if (value && value["_error"]) render.push(key)
    })
    return (
      <Popup
        trigger={<Spinner name='double-bounce'/>}
        position="right center"
        on="hover"
      >
        <>
          {render.map(key => (objectInspector(logs[key], `${key}`, `${key} logs`)))}
        </>
      </Popup>
    )
  }
}
