import { useState } from "react";
import { useNavigate } from "react-router";
import "./register.scss";
import axios from "axios";
import toast from "react-hot-toast";
import styled from "styled-components";
import BackgroundImage from "../../components/BackgroundImage/BackgroundImage";
import Header from "../../components/Header/Header";

const REGISTER_URL = "http://localhost:8800/api/auth/register";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formValues.password) {
      toast.error("Please fill in password");
      return;
    }

    try {
      const { email, password, username } = formValues;
      const response = await axios.post(REGISTER_URL, {
        email,
        username,
        password,
      });
      console.log(REGISTER_URL);
      console.log(response);

      toast.success(`User ${email.match(/^[^@]+/)[0]} registered successfully`);
      navigate("/");
    } catch (err) {
      if (!err || !err.response) {
        toast.error("No Server Response");
      } else if (err?.response?.status === 409) {
        toast.error("Username Already exists");
      } else {
        toast.error("Registration Failed");
      }
    }
  };

  return (
    <Container showPassword={showPassword}>
      <BackgroundImage />
      <div className="content">
        <Header login />
        <div className="body flex column a-center j-center">
          <div className="text flex column">
            <h1>Unlimited movies, TV shows and more.</h1>
            <h4>Watch anywhere. Cancel anytime.</h4>
            <h6>
              Ready to watch? Enter your email to create or restart membership.
            </h6>
          </div>
          <div className="form">
            {!showPassword ? (
              <>
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      [e.target.name]: e.target.value,
                    })
                  }
                  name="email"
                  value={formValues.email}
                />
                <input
                  type="username"
                  required
                  placeholder="Username"
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      [e.target.name]: e.target.value,
                    })
                  }
                  name="username"
                  value={formValues.username}
                />
                <button
                  onClick={() => {
                    if (formValues.email && formValues.username) {
                      setShowPassword(true);
                    } else {
                      toast.error("Please fill in email and username");
                    }
                  }}
                >
                  Get Started
                </button>
              </>
            ) : (
              <>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      [e.target.name]: e.target.value,
                    })
                  }
                  name="password"
                  value={formValues.password}
                />
                {showPassword && (
                  <button onClick={handleRegister}>Log In</button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  .content {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-rows: 15vh 85vh;
    .body {
      gap: 1rem;
      .text {
        gap: 1rem;
        text-align: center;
        font-size: 2rem;
        h1 {
          padding: 0 25rem;
        }
      }
      .form {
        display: grid;
        grid-template-columns: 1fr; /* Only one column */
        width: 35%;
        input {
          height: 2rem;
          color: black;
          border: none;
          padding: 1.5rem;
          font-size: 1.2rem;
          border: 1px solid black;
          &:focus {
            outline: none;
          }
          &:first-child {
            margin-bottom: 1rem; /* Add margin below the first input */
          }
        }
        button {
          padding: 0.5rem 1rem;
          background-color: #e50914;
          border: none;
          cursor: pointer;
          color: white;
          border-radius: 0.2rem;
          font-weight: bolder;
          font-size: 1.05rem;
        }
      }
      button {
        padding: 0.5rem 1rem;
        background-color: #e50914;
        border: none;
        cursor: pointer;
        color: white;
        border-radius: 0.2rem;
        font-weight: bolder;
        font-size: 1.05rem;
      }
    }
  }
`;
