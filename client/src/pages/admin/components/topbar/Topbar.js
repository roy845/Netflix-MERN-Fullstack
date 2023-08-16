import React from "react";
import "./topbar.scss";
import { NotificationsNone, Language, Settings } from "@material-ui/icons";
import Clock from "../Clock/Clock";
import { useNavigate } from "react-router-dom";

const Topbar = ({ title, imgSrc }) => {
  const navigate = useNavigate();
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">{title}</span>
        </div>

        <div className="topRight">
          <Clock />
          <div className="topbarIconContainer">
            <NotificationsNone />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Language />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Settings />
          </div>
          {imgSrc && (
            <img
              src={imgSrc}
              alt=""
              className="topAvatar"
              onClick={() => navigate(-1)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
