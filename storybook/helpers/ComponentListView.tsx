import * as React from "react";
import {
  Typography,
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  Select,
  MenuItem,
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
  protocolConfig: ProtocolConfig<any>;
  scopes?: { name: string; prop: PropertyData }[];
  ScopeContext?: React.FunctionComponent<React.PropsWithChildren<PropBag>>;
  getId: (data: any) => string;
}

type PropBag = { [name: string]: any };

interface State {
  scopeSelect: number;
  props: PropBag;
}

export default class ComponentListView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let stateProps: { [name: string]: any } = {};

    if (props.scopes) {
      props.scopes.forEach(({ prop }) => {
        stateProps[prop.name] = prop.defaultValue;
      });
    }

    this.state = {
      scopeSelect: -1,
      props: stateProps,
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
      ScopeContext,
      getId,
    } = this.props;
    const { scopeSelect, props } = this.state;

    const setProps = (props: any) =>
      this.setState({
        props,
        scopeSelect,
      });

    const setScope = (scope: string) =>
      this.setState({
        scopeSelect: Number(scope),
        props,
      });

    const ScopeSelect = ({}) => (
      <>
        {scopes ? (
          <Select
            value={scopeSelect}
            onChange={(event) => setScope(event.target.value)}
          >
            <MenuItem value={-1}>Null</MenuItem>
            {scopes.map(({ name }, index) => (
              <MenuItem value={index}>{name}</MenuItem>
            ))}
          </Select>
        ) : (
          <></>
        )}
      </>
    );

    let scope = undefined;
    if (scopes && scopeSelect > -1) {
      scope = scopes[scopeSelect];
    }

    const renderComponentList = (
      <ComponentListType scope={scope ? scope.name : undefined}>
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
                          {ObjectInspector(
                            entity,
                            `${name}.Entity`,
                            "Entity Instance"
                          )}
                          <Typography variant="h6" component="h6">
                            Data
                          </Typography>
                          {ObjectInspector(
                            data,
                            `${name}.Data`,
                            "Semantic Data"
                          )}
                          <Typography variant="h6" component="h6">
                            Logs
                          </Typography>
                          {ObjectInspector(
                            logs.react,
                            `${name}.ReactLogs`,
                            "React Logs"
                          )}
                          {ObjectInspector(
                            logs.entity,
                            `${name}.EntityLogs`,
                            "Entity Logs"
                          )}
                          {ObjectInspector(
                            logs.data,
                            `${name}.DataLogs`,
                            "Data Query Logs"
                          )}
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
    );

    return (
      <ProtocolType config={protocolConfig}>
        <Typography variant="h3" component="h3">
          {name}
        </Typography>
        <Divider />
        <ScopeSelect />
        <Divider />
        {scope ? (
          <PropertyEditors
            properties={[scope.prop]}
            state={this.state.props}
            setState={setProps}
          />
        ) : (
          <></>
        )}
        {ScopeContext
          ? ScopeContext({
              children: renderComponentList,
              ...props,
            })
          : renderComponentList}
      </ProtocolType>
    );
  }
}
