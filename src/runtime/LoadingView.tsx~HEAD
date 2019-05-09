import * as React from "react";
import Popup from 'reactjs-popup'
import { ComponentLogs } from "../../src";

const R = require('ramda')
const Spinner = require("react-spinkit");

interface Props {
  logs: ComponentLogs
}

export default class LoadingView extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  private keys: Array<any> = [];

  private findErrorKeys = (value: any, key: any) => {
    if (value && value["_error"]) this.keys.push(key)
  }

  public render() {
    const { logs } = this.props;

    R.forEachObjIndexed(this.findErrorKeys, logs);
    return (
      <Popup
        trigger={<Spinner name='double-bounce'/>}
        position="right center"
        on="hover"
        contentStyle={{ width: "auto", display: "flex", flexWrap: "wrap" }}
      >
        <div>
          {this.keys.map(key => logs[key]["_error"].message)}
        </div>
      </Popup>
    )
  }
}
