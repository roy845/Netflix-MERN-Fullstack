import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Topbar from "../../pages/admin/components/topbar/Topbar";
import { useNavigate } from "react-router-dom";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { ArrowForward } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    display: "flex",
    fontSize: "24px",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid white",
    textAlign: "center",
    color: "white",
    backgroundColor: "black",
    transition: "background-color 0.3s",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#558dab",
    },
    width: "95%", // Adjusted width to fit the container
    height: 250,
    marginTop: 20,
    marginLeft: 10,
  },
  backButton: {
    marginTop: theme.spacing(2),
    backgroundColor: "black",
    border: "1px solid white",
    color: "white",
    justifyContent: "flex-end",
    "&:hover": {
      backgroundColor: "#558dab",
    },
  },
}));

export default function MainDashboard() {
  const classes = useStyles();
  const navigate = useNavigate();

  function FormRow() {
    return (
      <React.Fragment>
        <Grid item xs={4}>
          <Paper className={classes.paper}>item</Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>item</Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>item</Paper>
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <div className={classes.root}>
      <Topbar title={"Analytics Dashboard"} />
      <Grid container spacing={2}>
        <Grid container item xs={12}>
          <Grid item xs={4}>
            <Paper
              onClick={() => navigate("/watchingAnalytics")}
              className={classes.paper}
            >
              Watching Analytics
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>item</Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>item</Paper>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <FormRow />
        </Grid>
        <Grid container item xs={12}>
          <FormRow />
        </Grid>
      </Grid>
      <Button
        className={classes.backButton}
        endIcon={<ArrowForward />}
        onClick={() => navigate("/")}
      >
        Back
      </Button>
    </div>
  );
}
