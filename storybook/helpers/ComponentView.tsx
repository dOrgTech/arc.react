import * as React from "react";
import {
  Typography,
  Divider
} from "@material-ui/core";

import { ComponentLogs } from "../../src";
import ObjectInspector from "./ObjectInspector";
import { ProtocolConfig } from "../../src/runtime";
import { PropertyEditors, PropertyData, PropertyType } from "./PropertyEditors";
export { PropertyData, PropertyType };

interface Props {
  name: string;
  ComponentType: any;
  ProtocolType: any;
  protocolConfig: ProtocolConfig;
  AddedContext?: React.FunctionComponent<React.PropsWithChildren<State>>
  propEditors: PropertyData[];
}

interface State {
  [name: string]: any
}

export default class ComponentView extends React.Component<Props, State>
{
  constructor(props: Props) {
    super(props);

    let newState: {[name: string]: any} = { };

    props.propEditors.forEach(editor => {
      newState[editor.name] = editor.defaultValue;
    });

    this.state = newState;
  }

  public render() {
    const {
      name,
      ComponentType,
      ProtocolType,
      protocolConfig,
      AddedContext,
      propEditors
    } = this.props;

    const renderComponent = (
      <>
      <Typography variant="h3" component="h3">
        {name}
      </Typography>
      <Divider />
      <Typography variant="h6" component="h6">
        Properties
      </Typography>
      <PropertyEditors properties={propEditors} state={this.state} setState={(state) => this.setState(state)} />
      <ComponentType {...this.state}>
        <ComponentType.Entity>
        <ComponentType.Data>
        <ComponentType.Logs>
        {(entity: any, data: any, logs: ComponentLogs) => (
          <>
          <Typography variant="h6" component="h6">
            Entity
          </Typography>
          {ObjectInspector(entity, `${name}.Entity`, "Entity Instance")}
          <Typography variant="h6" component="h6">
            Data
          </Typography>
          {ObjectInspector(data, `${name}.Data`, "Semantic Data")}
          <Typography variant="h6" component="h6">
            Logs
          </Typography>
          {ObjectInspector(logs.react, `${name}.ReactLogs`, "React Logs")}
          {ObjectInspector(logs.entity, `${name}.EntityLogs`, "Entity Logs")}
          {ObjectInspector(logs.data, `${name}.DataLogs`, "Data Query Logs")}
          {ObjectInspector(logs.code, `${name}.CodeLogs`, "Code Logs")}
          {ObjectInspector(logs.prose, `${name}.ProseLogs`, "Prose Logs")}
          </>
        )}
        </ComponentType.Logs>
        </ComponentType.Data>
        </ComponentType.Entity>
      </ComponentType>
      </>
    );

    return (
      <ProtocolType config={protocolConfig}>
      {AddedContext ? 
        AddedContext({
          children: renderComponent,
          ...this.state
        })
      : renderComponent}
      </ProtocolType>
    );
  }
}

