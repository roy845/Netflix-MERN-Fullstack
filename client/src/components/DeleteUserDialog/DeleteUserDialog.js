import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { makeStyles } from "@material-ui/core/styles";
const DELETE_USER_URL = "http://localhost:8800/api/users/deleteUser/";
const useStyles = makeStyles((theme) => ({
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
  dialog: {
    "& .MuiPaper-root": {
      backgroundColor: "#000",
      color: "#fff",
    },
  },
}));
export default function DeleteUserDialog({ open, onClose, user }) {
  const classes = useStyles();
  const navigate = useNavigate();
  //delete user
  const deleteUser = async (id) => {
    try {
      const { data } = await axios.delete(`${DELETE_USER_URL}${id}`, {
        headers: {
          Authorization: JSON.parse(localStorage.getItem("auth"))?.token,
        },
      });
      toast.success(data?.message);
      localStorage.removeItem("auth");
      navigate("/register");
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Error in deleting the profile");
    }
  };

  const handleClose = () => {
    onClose(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.dialog}
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: "white" }}
          >
            {`Are you sure Deleting profile ${user?.username} ?
            All your data will lost`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            className={classes.watchButton}
          >
            Disagree
          </Button>
          <Button
            onClick={() => deleteUser(user?._id)}
            color="primary"
            className={classes.watchButton}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
