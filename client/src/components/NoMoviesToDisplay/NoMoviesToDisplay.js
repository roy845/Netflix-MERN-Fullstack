import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, CardHeader, Typography } from "@material-ui/core";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "110vh",
    margin: "auto",
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
}));

const NoMoviesToDisplay = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title={<Typography variant="h4">No Content To Display</Typography>}
        />
        <CardContent>
          <RemoveCircleOutlineIcon className={classes.icon} />
          <Typography variant="body1" style={{ color: "white" }}>
            Oops! There is no content to display at the moment. Please check
            back later.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoMoviesToDisplay;
