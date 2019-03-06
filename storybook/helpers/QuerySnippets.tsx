import * as React from "react";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Theme,
  withStyles,
  createStyles,
  createMuiTheme,
} from "@material-ui/core";
import { GraphqlCodeBlock } from "graphql-syntax-highlighter-react";

const queries = [
{
  name: "All DAOs",
  code: 
`{
  daos {
    id
    name
    nativeReputation {
      id
    }
    nativeToken {
      id
    }
  }
}`
},
{
  name: "All Proposals",
  code:
`{
  proposals {
    id
    title
    description
    stage
  }
}`
},
{
  name: "All Members",
  code:
`{
  members {
    id
    address
    reputation
    dao {
      id
      name
    }
  }
}`
}];

const QuerySnippets: React.SFC = () => (
  <>
    {queries.map(query => (
      <ExpansionPanel>
        <ExpansionPanelSummary>
          <Typography>{query.name}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <GraphqlCodeBlock 
            queryBody={query.code} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    ))}
  </>
);

const styles = (theme: Theme) => 
  createStyles({
    root: {
      width: "100%",
    }
  });

export default withStyles(styles)(QuerySnippets);
