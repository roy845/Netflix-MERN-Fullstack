import { useState, useEffect, useContext } from "react";
import "./Profiles.scss";
import { Button, Grid, TextField, makeStyles } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext/UserContext";
import { useAuth } from "../../context/authContext/AuthContext";
import { AuthContext } from "../../context/authContext/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { CircularProgress } from "@material-ui/core";
import NoUsersToDisplay from "../NoUsersToDisplay/NoUsersToDisplay";

const GET_ALL_USERS_URL = "http://localhost:8800/api/users/getAllUsers";
const BASE_IMAGE_URL = "http://localhost:8800/api/users/getUserPhoto/";
const LOGIN_URL = "http://localhost:8800/api/auth/login";

const useStyles = makeStyles(() => ({
  watchButton: {
    backgroundColor: "#e50914",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#b20710",
    },
    dialogContent: {
      overflowY: "auto",
    },
  },
}));

const Profiles = () => {
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [showTextField, setShowTextField] = useState(false);

  const [profilesData, setProfilesData] = useState([]);
  const [changeProfile, setChangeProfile] = useState(false);
  const [showManageIcon, setShowManageIcon] = useState(true);
  const [password, setPassword] = useState("");
  const { defaultAvatar } = useContext(UserContext);
  const { auth, setAuth } = useAuth();
  const { isLoading, setIsLoading } = useContext(AuthContext);
  const [profilesLoading, setProfilesLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();

  let from = location.state?.from?.pathname
    ? location.state.from.pathname
    : "/";
  const handleProfileClick = async (profileId) => {
    setSelectedProfileId(profileId);
    setShowTextField(!showTextField);
  };

  const handleLogin = async (profileId) => {
    if (!password) {
      toast.error("Enter your password in order to connect to your profile");
      return;
    }

    const { email } = profilesData.find((p) => p._id === profileId);
    try {
      const { data } = await axios.post(LOGIN_URL, { email, password });
      setAuth(data);
      localStorage.removeItem("auth");
      localStorage.setItem("auth", JSON.stringify(data));
      axios.defaults.headers.common["Authorization"] = data.token;
      toast.success("login successfully");
      navigate(from, { replace: true });
      setIsLoading(true);
      setPassword("");
    } catch (err) {
      console.log(err);
      if (!err || !err.response) {
        toast.error("No Server Response");
      } else if (err.response?.status === 400) {
        toast.error("Missing Username or Password");
      } else if (err?.response?.status === 404) {
        toast.error(err?.response?.data.message);
      } else if (err.response?.status === 401) {
        toast.error("Unauthorized");
      } else {
        toast.error("Login Failed");
      }
    }
  };

  const handleProfileChangeClick = () => {
    setShowManageIcon(false);
    setChangeProfile(true);
  };

  const handleDoneClick = () => {
    setShowManageIcon(true);
    setChangeProfile(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setProfilesLoading(true);
      const { data } = await axios.get(GET_ALL_USERS_URL);
      setProfilesLoading(false);
      setProfilesData(data);
    };
    fetchData();
  }, []);

  return (
    <>
      {profilesLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "red",
            height: "70vh",
          }}
        >
          <CircularProgress style={{ color: "red" }} />
        </div>
      ) : (
        <>
          {profilesData.length === 0 ? (
            <NoUsersToDisplay />
          ) : (
            <>
              <div className="left">
                <img
                  width="300px"
                  height="300px"
                  src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
                  alt=""
                />
              </div>
              <div className="profiles">
                {changeProfile ? (
                  <h2 className="profiles__title">Profile Management</h2>
                ) : (
                  <h2 className="profiles__title">Who's Watching?</h2>
                )}

                <Grid
                  container
                  spacing={3}
                  className="profiles__list"
                  style={{ marginTop: "100px" }}
                >
                  {profilesData.map((profile) => (
                    <Grid item xs={6} key={profile._id}>
                      <div
                        className={`profiles__item ${
                          selectedProfileId === profile._id ? "selected" : ""
                        }`}
                      >
                        {showManageIcon ? (
                          <div className="manage">
                            <EditIcon
                              onClick={handleProfileChangeClick}
                              className="profiles__item-edit-icon"
                            />
                            <span
                              className="profiles__item-edit-icon"
                              style={{ marginLeft: "30px", color: "white" }}
                            >
                              Manage
                            </span>
                            <div
                              className="back-button__text"
                              onClick={() => navigate("/")}
                            >
                              <h2 className="editProfileHeader">Go back</h2>
                              <div className="back-icon">
                                <Link to="/profiles" className="link">
                                  <NavigateNextIcon />
                                </Link>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="manage">
                            <CloseOutlinedIcon
                              onClick={handleDoneClick}
                              className="profiles__item-edit-icon"
                            />
                            <span
                              className="profiles__item-edit-icon"
                              style={{ marginLeft: "30px", color: "white" }}
                            >
                              Done
                            </span>
                          </div>
                        )}

                        <img
                          src={
                            profile.profilePic.data.data.length === 0
                              ? defaultAvatar
                              : `${BASE_IMAGE_URL}${
                                  profile._id
                                }?t=${Date.now()}`
                          }
                          alt={profile.username}
                          onClick={() => handleProfileClick(profile._id)}
                        />
                        <span className="profiles__item-name">
                          {profile.username}
                        </span>
                        {selectedProfileId === profile?._id &&
                          showTextField && (
                            <div className="profile-text-button">
                              <TextField
                                required
                                fullWidth
                                type="password"
                                label="Password"
                                name="username"
                                value={password}
                                id="name"
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                  style: { backgroundColor: "#fff" },
                                }}
                                InputLabelProps={{
                                  style: { color: "#fff" },
                                }}
                              />
                              <Button
                                variant="contained"
                                color="primary"
                                className={classes.watchButton}
                                target="_blank"
                                onClick={() => handleLogin(profile._id)}
                              >
                                Connect
                              </Button>
                            </div>
                          )}

                        <div className="edit-profile">
                          {changeProfile && (
                            <Link
                              to={`/editProfile/${profile._id}`}
                              className="link"
                            >
                              <EditOutlinedIcon className="profiles__item-edit-profile-icon" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Profiles;
