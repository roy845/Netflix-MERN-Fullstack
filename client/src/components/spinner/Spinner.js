import React from "react";
import { Bars } from "react-loader-spinner";
import "./spinner.scss";

const LoadingSpinner = () => {
  return (
    <div className="spinner" style={{ height: "70vh" }}>
      <Bars color="red" />
    </div>
  );
};

export default LoadingSpinner;
