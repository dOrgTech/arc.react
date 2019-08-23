import * as React from "react";
import {
  Typography,
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  Select,
  MenuItem
} from "@material-ui/core";

import { ComponentLogs, ProtocolConfig } from "../../src";
import ObjectInspector from "./ObjectInspector";
import { PropertyEditors, PropertyData, PropertyType } from "./PropertyEditors";
export { PropertyData, PropertyType };

interface Props {
  name: string;
  ComponentListType: any;
  ComponentType: any;
  ProtocolType: any;
  protocolConfig: ProtocolConfig;
  scopes?: string[];
  AddedContext?: React.FunctionComponent<React.PropsWithChildren<PropBag>>;
  propEditors: PropertyData[];
  getId: (data: any) => string;
}

type PropBag = {[name: string]: any};

interface State {
  scopeSelect: string
  props: PropBag
}

export default class ComponentListView extends React.Component<Props, State>
{
  constructor(props: Props) {
    super(props);

    let stateProps: {[name: string]: any} = { };

    props.propEditors.forEach(editor => {
      stateProps[editor.name] = editor.defaultValue;
    });

    this.state = {
      scopeSelect: "",
      props: stateProps
    };
  }

  public render() {
    const {
      name,
      ComponentListType,
      ComponentType,
      ProtocolType,
      protocolConfig,
      scopes,
      AddedContext,
      propEditors,
      getId
    } = this.props;
    const {
      scopeSelect,
      props
    } = this.state;

    const setProps = (props: any) => this.setState({
      props,
      scopeSelect
    });

    const setScope = (scope: string) => this.setState({
      scopeSelect: scope,
      ...this.state
    });

    const ScopeSelect = ({}) => (
      <>
      {scopes ?
        <Select value={scopeSelect} onChange={(event) => setScope(event.target.value)}>
          <MenuItem value={""}>Null</MenuItem>
          {scopes.map(scope => 
            <MenuItem value={scope}>{scope}</MenuItem>
          )}
        </Select>
      : <></>}
      </>
    );

    const scope = scopeSelect === "" ? undefined : scopeSelect;

    const renderComponentList = (
      <>
      <Typography variant="h3" component="h3">
        {name}
      </Typography>
      <Divider />
      <ScopeSelect />
      <Divider />
      <PropertyEditors properties={propEditors} state={this.state.props} setState={setProps} />
      <ComponentListType scope={scope} {...props}>
        <ComponentType.Entity>
        <ComponentType.Data>
        <ComponentType.Logs>
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
        </ComponentType.Logs>
        </ComponentType.Data>
        </ComponentType.Entity>
      </ComponentListType>
      </>
    );

    return (
      <ProtocolType config={protocolConfig}>
      {AddedContext ?
        AddedContext({
          children: renderComponentList,
          ...props
        })
      : renderComponentList}
      </ProtocolType>
    );
  }
}
