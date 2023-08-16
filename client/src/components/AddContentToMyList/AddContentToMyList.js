import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
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
    fontSize: 128,
    marginBottom: theme.spacing(2),
    color: "white",
  },
  button: {
    marginTop: theme.spacing(2),
    backgroundColor: "white",
    color: "black",
  },
}));

const AddContentToMyList = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const goToHomepage = () => navigate("/");

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title={<Typography variant="h4">My List</Typography>}
        />
        <CardContent>
          <CheckCircleIcon className={classes.icon} />
          <Typography variant="body1" style={{ color: "white" }}>
            Add movies and TV shows to your list so that you can easily find
            them later.
          </Typography>
          <Button
            className={classes.button}
            variant="contained"
            onClick={goToHomepage}
          >
            Search for titles to watch
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddContentToMyList;
