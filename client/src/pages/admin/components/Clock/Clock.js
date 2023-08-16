import React, { useEffect, useState } from "react";
import "./Clock.scss";

const Clock = () => {
  const [clockState, setClockState] = useState(
    localStorage.getItem("clockState") || ""
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      const date = new Date();
      const timeString = date.toLocaleTimeString();
      setClockState(timeString);
      localStorage.setItem("clockState", timeString);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <div className="clock">{clockState}</div>;
};

export default Clock;
