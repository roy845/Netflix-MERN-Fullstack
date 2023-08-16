import React from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "#272d38",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    boxShadow: theme.shadows[3],
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    marginTop: "10px",
    "&:hover": {
      backgroundColor: "#558dab",
      boxShadow: theme.shadows[5],
    },
    display: "flex",
    alignItems: "center", // Add alignItems: center to center text vertically
    textDecoration: "none", // Add textDecoration: none to remove underline
  },
  text: {
    color: theme.palette.common.white,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    margin: "auto", // Add margin: auto to center the text horizontally
  },
}));

//color for dark mode #730580

const FancyBox = ({ children, movie, to }) => {
  const classes = useStyles();
  console.log(movie);
  return (
    <>
      {movie ? (
        <Box
          role="button"
          component={RouterLink}
          to={to}
          className={classes.container}
        >
          <div className={classes.text}>{children}</div>
        </Box>
      ) : (
        <Box role="button" className={classes.container}>
          <div className={classes.text}>{children}</div>
        </Box>
      )}
    </>
  );
};

export default FancyBox;
