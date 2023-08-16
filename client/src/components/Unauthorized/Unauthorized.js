import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
} from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";
import { useNavigate } from "react-router";

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
  },
}));

const Unauthorized = ({ profilesPath }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const goBack = () => navigate(profilesPath);

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title={<Typography variant="h4">Unauthorized</Typography>}
        />
        <CardContent>
          <LockIcon className={classes.icon} />
          <Typography variant="body1" style={{ color: "white" }}>
            You do not have permission to access this page.
          </Typography>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={goBack}
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;
