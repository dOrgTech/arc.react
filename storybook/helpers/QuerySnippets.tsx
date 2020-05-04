import * as React from "react";
import { Typography, withStyles } from "@material-ui/core";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import { GraphqlCodeBlock } from "graphql-syntax-highlighter-react";

const queries = [
  {
    name: "All DAOs",
    data: `{
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
}`,
  },
  {
    name: "All Proposals",
    data: `{
  proposals {
    id
    title
    description
    stage
  }
}`,
  },
  {
    name: "All Members",
    data: `{
  members {
    id
    address
    reputation
    dao {
      id
      name
    }
  }
}`,
  },
];

const ExpansionPanel = withStyles({
  root: {
    border: "1px solid rgba(0,0,0,.125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
  },
  expanded: {
    margin: "auto",
  },
})(MuiExpansionPanel);

const ExpansionPanelSummary: any = withStyles({
  root: {
    backgroundColor: "rgba(0,0,0,.03)",
    borderBottom: "1px solid rgba(0,0,0,.125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})((props) => <MuiExpansionPanelSummary {...props} />);

ExpansionPanelSummary.muiName = "ExpansionPanelSummary";

const ExpansionPanelDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
}))(MuiExpansionPanelDetails);

const QuerySnippets: React.SFC = () => (
  <>
    {queries.map((query) => (
      <ExpansionPanel key={query.name}>
        <ExpansionPanelSummary>
          <Typography>{query.name}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <GraphqlCodeBlock queryBody={query.data} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    ))}
  </>
);

export default QuerySnippets;
