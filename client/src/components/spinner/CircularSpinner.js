import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./circularSpinner.scss";

const CircularSpinner = () => {
  return (
    <div className="circularSpinner" style={{ height: "70vh" }}>
      <CircularProgress style={{ color: "red" }} />
    </div>
  );
};

export default CircularSpinner;
