import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  CircularProgress,
} from "@material-ui/core";

import { useNavigate } from "react-router";
import TimelineIcon from "@material-ui/icons/Timeline";
import CircularSpinner from "../spinner/CircularSpinner";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  card: {
    minWidth: 300,
    maxWidth: 500,
    padding: theme.spacing(4),
    textAlign: "center",
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(6),
    },
    border: "2px solid red", // add border and borderColor properties
    borderColor: "red",
    backgroundColor: "black",
  },
  header: {
    textAlign: "center",
    paddingBottom: 0,
    color: "white",
  },
  icon: {
    fontSize: 64,
    marginBottom: theme.spacing(2),
    color: "white",
  },
  button: {
    marginTop: theme.spacing(2),
    backgroundColor: "#e50914",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#b20710",
    },
    dialogContent: {
      overflowY: "auto",
    },
  },
}));

const NoAnalyticData = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title={<Typography variant="h4">No Analytic Data</Typography>}
        />
        <CardContent>
          <TimelineIcon className={classes.icon} />
          <Typography variant="body1" style={{ color: "white" }}>
            There are no analytics data to display yet
          </Typography>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={goBack}
          >
            Go Back
          </Button>
          <CircularProgress
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "red",
              marginTop: 10,
              marginLeft: 125,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NoAnalyticData;
