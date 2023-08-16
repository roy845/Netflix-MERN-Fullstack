import React from "react";
import { Bars } from "react-loader-spinner";
import "./homeSpinner.scss";

const HomeSpinner = () => {
  return (
    <div className="homeSpinner">
      <Bars color="red" />
    </div>
  );
};

export default HomeSpinner;
