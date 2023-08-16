import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormGroup,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Switch,
} from "@material-ui/core";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import CreateIcon from "@material-ui/icons/Create";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import NotificationsIcon from "@material-ui/icons/Notifications";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import SpeedIcon from "@material-ui/icons/Speed";
import DevicesIcon from "@material-ui/icons/Devices";
import { AuthContext } from "../../context/authContext/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

import DiskUsage from "../DiskQuata/DiskQuata";
import DeviceInfo from "../DeviceInfo/DeviceInfo";

const GET_NOTIFICATIONS_STATUS =
  "http://localhost:8800/api/users/getNotificationsStatus/";
const UPDATE_NOTIFICATIONS_STATUS =
  "http://localhost:8800/api/users/updateNotificationsStatus/";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "black",
    color: "white",
  },
  closeButton: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    color: "#fff",
    zIndex: 1,
    cursor: "pointer",
  },
  updateProfile: {
    backgroundColor: "#e50914",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#b20710",
    },
  },
  switch: {
    color: "white",
  },
  dialogContent: {
    overflowY: "auto",
  },
}));

const SettingsForm = ({ open, onClose }) => {
  const classes = useStyles();
  const { auth, setAuth } = useContext(AuthContext);
  const [isUpdatingNotificationsStatus, setIsUpdatingNotificationsStatus] =
    useState(false);
  const [notificationsStatusChanged, setNotificationsStatusChanged] =
    useState(false);

  const [isNotificationsOn, setIsNotificationsOn] = useState(false);

  const handleSwitchChange = (event) => {
    setNotificationsStatusChanged(true);
    setIsNotificationsOn(event.target.checked);
    toast.success(
      event.target.checked ? "Notifications Enabled" : "Notifications Disabled"
    );
  };

  useEffect(() => {
    const getNotificationsStatus = async () => {
      try {
        const { data } = await axios.get(
          `${GET_NOTIFICATIONS_STATUS}${auth?.user._id}`
        );
        console.log(data);
        setIsNotificationsOn(data);
      } catch (error) {
        console.log(error);
      }
    };
    getNotificationsStatus();
  }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     setIsUpdatingNotificationsStatus(true);
  //     const { data } = await axios.put(
  //       `${UPDATE_NOTIFICATIONS_STATUS}${auth?.user?._id}`,
  //       { on: isNotificationsOn }
  //     );
  //     setIsUpdatingNotificationsStatus(false);
  //     onClose();
  //     toast.success(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleClose = async () => {
    if (notificationsStatusChanged) {
      try {
        setIsUpdatingNotificationsStatus(true);
        const { data } = await axios.put(
          `${UPDATE_NOTIFICATIONS_STATUS}${auth?.user?._id}`,
          { on: isNotificationsOn }
        );
        setIsUpdatingNotificationsStatus(false);
        onClose();
        toast.success(data);
      } catch (error) {
        console.log(error);
      }
      setNotificationsStatusChanged(false);
    }

    onClose(false);
  };

  const dateString = auth.user.createdAt.toString();
  const date = new Date(dateString);
  const formattedDate = date.toLocaleString();

  return (
    <Dialog open={open} onClose={handleClose} classes={{ paper: classes.root }}>
      <CloseIcon className={classes.closeButton} onClick={handleClose} />
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <form>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormGroup>
                  <h2 style={{ marginBottom: "10px" }}>Notifications</h2>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Switch
                      className={classes.switch}
                      checked={isNotificationsOn}
                      onChange={handleSwitchChange}
                    />

                    {isNotificationsOn ? (
                      <NotificationsActiveIcon
                        style={{ color: "gold", marginLeft: "10px" }}
                      />
                    ) : (
                      <NotificationsIcon
                        style={{ color: "white", marginLeft: "10px" }}
                      />
                    )}
                    <span style={{ marginLeft: "10px", color: "white" }}>
                      {isNotificationsOn
                        ? "Turn off notifications"
                        : "Turn on notifications"}
                    </span>
                  </div>
                  <hr style={{ color: "white", width: "150%" }} />
                  <h2 style={{ marginBottom: "10px" }}>Diagnosis</h2>
                  <Link to="https://fast.com/" className="link">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <SpeedIcon
                        style={{
                          color: "white",
                          marginLeft: "70px",
                        }}
                      />
                      <span style={{ marginLeft: "10px", color: "white" }}>
                        Speed Test
                      </span>
                    </div>
                  </Link>
                  <hr style={{ color: "white", width: "150%" }} />
                  <h2 style={{ marginBottom: "10px" }}>Disk Usage</h2>
                  <DiskUsage />
                  <hr style={{ color: "white", width: "150%" }} />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <h2 style={{ marginLeft: "10px" }}>About</h2>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <DevicesIcon />
                    <h2 style={{ marginLeft: "10px" }}>Device</h2>
                    <DeviceInfo />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      marginBottom: "10px",
                    }}
                  >
                    <PermIdentityIcon />
                    <h2 style={{ marginLeft: "10px" }}>Account</h2>
                    <h3 style={{ marginLeft: "10px" }}>{auth?.user?.email}</h3>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      marginBottom: "10px",
                    }}
                  >
                    <CreateIcon />
                    <h2 style={{ marginLeft: "10px" }}>Created</h2>
                    <h4 style={{ marginLeft: "10px" }}>{formattedDate}</h4>
                  </div>

                  <hr style={{ color: "white", width: "150%" }} />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormGroup></FormGroup>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      {/* <DialogActions>
        <Button
          onClick={handleClose}
          className={classes.updateProfile}
          color="secondary"
        >
          Cancel
        </Button>
        {isUpdatingNotificationsStatus ? (
          <CircularProgress style={{ color: "red" }} />
        ) : (
          <Button
            variant="contained"
            color="primary"
            className={classes.updateProfile}
            onClick={handleSubmit}
          >
            Save
          </Button>
        )}
      </DialogActions> */}
    </Dialog>
  );
};

export default SettingsForm;
