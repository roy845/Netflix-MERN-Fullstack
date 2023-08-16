import { useState, useContext } from "react";
import "./navbar.scss";
import { ArrowDropDown, Notifications, Search } from "@material-ui/icons";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext/AuthContext";
import toast from "react-hot-toast";
import { Settings, ExitToApp } from "@material-ui/icons";
import SettingsForm from "../SettingsForm/SettingsForm";
import { UserContext } from "../../context/userContext/UserContext";
import { Badge } from "@material-ui/core";
import TimelineIcon from "@material-ui/icons/Timeline";
import axios from "axios";

const BASE_IMAGE_URL = "http://localhost:8800/api/users/getUserPhoto/";
const LOGOUT = "http://localhost:8800/api/auth/logout/";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { auth, setAuth } = useAuth();
  const [openSettings, setOpenSettings] = useState(false);
  const { defaultAvatar, notificationsCount } = useContext(UserContext);
  const navigate = useNavigate();

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  const logout = async () => {
    try {
      const { data } = await axios.post(`${LOGOUT}${auth?.user?._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem("currentTime");
    localStorage.removeItem("currentTimeEpisode");
    localStorage.removeItem("duration");
    localStorage.removeItem("auth");
    logout();
    toast.success("Logout Successfully");
  };

  const showSettingsModal = () => {
    setOpenSettings(true);
  };

  return (
    <div className={isScrolled ? "navbar scrolled" : "navbar"}>
      <div className="container">
        <div className="left">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
            alt=""
            onClick={() => navigate("/")}
          />
          <Link to="/" className="link">
            <span>Homepage</span>
          </Link>

          <Link to="/series" className="link">
            <span>Series</span>
          </Link>
          <Link to="/movies" className="link">
            <span>Movies</span>
          </Link>
          <Link className="link">
            <span>New and Popular</span>
          </Link>

          <Link to="/myList" className="link">
            <span>My List</span>
          </Link>

          {auth?.user.isAdmin && (
            <Link className="link" to="/dashboard">
              <span>Admin</span>
            </Link>
          )}
        </div>
        <div className="right">
          <Link to="/searchMovies" className="link">
            <Search className="icon" />
          </Link>

          <Badge
            badgeContent={notificationsCount}
            showZero
            color="secondary"
            style={{
              cursor: "pointer",
              marginRight: "30px",
              marginLeft: "25px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Link to="/notifications" className="link">
                <Notifications style={{ cursor: "pointer", color: "white" }} />
              </Link>
            </div>
          </Badge>

          <Link to="/profiles" className="link">
            <img
              src={
                auth?.user?.profilePic?.data?.data.length === 0
                  ? defaultAvatar
                  : `${BASE_IMAGE_URL}${auth?.user?._id}?t=${Date.now()}`
              }
              alt=""
            />
          </Link>

          <div className="profile">
            <div className="arrow-container">
              <div className="username">{auth?.user.username}</div>
              <ArrowDropDown className="icon" />
            </div>

            <div className="options">
              <span onClick={showSettingsModal}>
                <Settings onClick={showSettingsModal} /> Settings
              </span>
              <span onClick={() => navigate("/mainAnalyticsDashboard")}>
                <TimelineIcon
                  onClick={() => navigate("/mainAnalyticsDashboard")}
                />{" "}
                Analytics
              </span>
              <NavLink className="link" onClick={handleLogout}>
                <span>
                  <ExitToApp />
                  Logout
                </span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <SettingsForm open={openSettings} onClose={setOpenSettings} />
    </div>
  );
};

export default Navbar;
