import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, CardHeader, Typography } from "@material-ui/core";
import NotificationsOffIcon from "@material-ui/icons/NotificationsOff";

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
    border: "2px solid blue", // add border and borderColor properties
    borderColor: "blue",
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

const NoNotifications = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title={<Typography variant="h4">No Notifications</Typography>}
        />
        <CardContent>
          <NotificationsOffIcon className={classes.icon} />
          <Typography variant="body1" style={{ color: "white" }}>
            There are no notifications to display at this moment. Please check
            back later.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoNotifications;
