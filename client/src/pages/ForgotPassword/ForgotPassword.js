import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Typography, Container } from "@material-ui/core";
import { EmailOutlined } from "@material-ui/icons";
import { InputAdornment } from "@material-ui/core";
import axios from "axios";
import { toast } from "react-hot-toast";

const FORGOT_PASSWORD = "http://localhost:8800/api/auth/forgotPassword";

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
  },
  submitButton: {
    backgroundColor: "#e50914",
    margin: theme.spacing(2, 0),
    "&:hover": {
      backgroundColor: "#b20710",
    },
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

  input: {
    "&::placeholder": {
      color: "white", // Set the color of the placeholder to white
      opacity: 1, // Make the placeholder fully opaque
    },
  },
}));

const ForgotPassword = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(FORGOT_PASSWORD, { email });
      toast.success(data.message);
    } catch (error) {
      const { response } = error;
      console.log(error);
      if (response?.status === 400) {
        toast.error(response?.data?.message);
      }
    }
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="xs">
        <Typography variant="h4" align="center" gutterBottom>
          Forgot Password
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          Enter your email address and we'll send you a link to reset your
          password.
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            className={classes.formField}
            variant="outlined"
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined style={{ color: "#e50914" }} />
                </InputAdornment>
              ),
              placeholder: "Enter Email",
              classes: { root: classes.inputRoot, input: classes.input },
            }}
            InputLabelProps={{
              style: { color: "white" },
              shrink: true,
              classes: { root: classes.labelRoot },
            }}
          />

          <Button
            className={classes.submitButton}
            variant="contained"
            color="secondary"
            type="submit"
            fullWidth
          >
            Send Email
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default ForgotPassword;
