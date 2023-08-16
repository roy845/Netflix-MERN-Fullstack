import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Typography, Container } from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { InputAdornment } from "@material-ui/core";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

const RESET_PASSWORD_URL = "http://localhost:8800/api/auth/resetPassword";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(3),
  },
  formField: {
    width: "100%",
    marginBottom: theme.spacing(2),
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "& .MuiOutlinedInput-input": {
      color: "white",
    },
    "& .MuiInputLabel-root": {
      color: "white",
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-input": {
      color: "white",
      "&::placeholder": {
        color: "white",
        opacity: 1,
      },
    },
  },
  submitButton: {
    margin: theme.spacing(2, 0),
    backgroundColor: "#e50914",
    "&:hover": {
      backgroundColor: "#b20710",
    },
    input: {
      "&::placeholder": {
        color: "white",
        opacity: 1,
      },
    },
    labelRoot: {
      color: "white",
    },
    inputRoot: {
      color: "white", // Set the color of the text to white
      borderColor: "white",
    },
  },
}));

const ResetPassword = () => {
  const classes = useStyles();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmedPasswordValid, setIsConfirmedPasswordValid] =
    useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsConfirmedPasswordValid(confirmPassword === e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setIsConfirmedPasswordValid(password === e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(RESET_PASSWORD_URL, {
        token,
        password,
      });

      toast.success("Reset password successfully", "success");
      navigate("/");
    } catch (err) {
      console.log(err);
      if (!err || !err.response) {
        toast.error("No Server Response");
      } else if (err.response && err.response.status === 400) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Send Mail Failed");
      }
    }

    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className={classes.root}>
      {" "}
      <Container maxWidth="xs">
        <Typography variant="h4" align="center" gutterBottom>
          Reset Password
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            className={classes.formField}
            variant="outlined"
            label="New Password"
            type="password"
            required
            value={password}
            onChange={handlePasswordChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  ,
                  <LockOutlined style={{ color: "#e50914" }} />,
                </InputAdornment>
              ),
              placeholder: "Enter New Password",
              classes: { root: classes.inputRoot, input: classes.input },
            }}
            InputLabelProps={{
              style: { color: "white" },
              shrink: true,
              classes: { root: classes.labelRoot },
            }}
          />
          <TextField
            className={classes.formField}
            variant="outlined"
            label="Confirm Password"
            type="password"
            required
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  ,
                  <LockOutlined style={{ color: "#e50914" }} />,
                </InputAdornment>
              ),
              placeholder: "Confirm Password",
              classes: { root: classes.inputRoot, input: classes.input },
            }}
            InputLabelProps={{
              style: { color: "white" },
              shrink: true,
              classes: { root: classes.labelRoot },
            }}
          />
          {confirmPassword && (
            <Typography variant="caption">
              {isConfirmedPasswordValid ? (
                <span className="success">
                  <span className="icon">
                    <CheckIcon style={{ color: "green" }} />
                  </span>

                  <span className="text">{"Passwords match"}</span>
                </span>
              ) : (
                <span className="error">
                  <span className="icon">
                    <ClearIcon style={{ color: "red" }} />
                  </span>
                  <span className="text">{"Passwords Don't match"}</span>
                </span>
              )}
            </Typography>
          )}
          <Button
            className={classes.submitButton}
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={
              !password && !confirmPassword && !isConfirmedPasswordValid
            }
            style={{
              backgroundColor: !isConfirmedPasswordValid ? "gray" : "#e50914",
              color: !isConfirmedPasswordValid ? "white" : "white",
            }}
          >
            Reset Password
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default ResetPassword;
