import * as React from "react";
import {
  Typography,
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid
} from "@material-ui/core";

import { ComponentLogs } from "../../src";
import ObjectInspector from "./ObjectInspector";
import { PropertyEditors, PropertyData, PropertyType } from "./PropertyEditors";
export { PropertyData, PropertyType };

interface Props {
  name: string;
  ComponentList: any;
  Component: any;
  RequiredContext: React.FunctionComponent<React.PropsWithChildren<State>>;
  propEditors: PropertyData[];
  getId: (data: any) => string;
}

interface State {
  [name: string]: any;
}

export default class ComponentListView extends React.Component<Props, State>
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
    const { name, ComponentList, Component, RequiredContext, propEditors, getId } = this.props;
    const renderComponentList = (
      <>
      <Typography variant="h3" component="h3">
        {name}
      </Typography>
      <Divider />
      <PropertyEditors properties={propEditors} state={this.state} setState={(state) => this.setState(state)} />
      <ComponentList {...this.state}>
        <Component.Entity>
        <Component.Data>
        <Component.Logs>
        {(entity: any, data: any, logs: ComponentLogs) => {
          const id = getId(data);
          return (
            <>
            <ExpansionPanel key={id}>
              <ExpansionPanelSummary>
                <Typography>{id}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container direction="column">
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
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            </>
          );
        }}
        </Component.Logs>
        </Component.Data>
        </Component.Entity>
      </ComponentList>
      </>
    );

    return RequiredContext({
      children: renderComponentList,
      ...this.state
    });
  }
}
