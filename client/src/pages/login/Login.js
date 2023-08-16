import { useState, useContext } from "react";
import "./login.scss";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext/AuthContext";
import { AuthContext } from "../../context/authContext/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import BackgroundImage from "../../components/BackgroundImage/BackgroundImage";
import Header from "../../components/Header/Header";

const LOGIN_URL = "http://localhost:8800/api/auth/login";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { auth, setAuth } = useAuth();
  const { isLoading, setIsLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  let from = location.state?.from?.pathname
    ? location.state.from.pathname
    : "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      const { data } = await axios.post(LOGIN_URL, { email, password });

      setAuth(data);

      localStorage.setItem("auth", JSON.stringify(data));
      axios.defaults.headers.common["Authorization"] = data.token;
      toast.success("login successfully");

      navigate(from, { replace: true });
      setIsLoading(true);
      setEmail("");
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

  return (
    <Container>
      <BackgroundImage />
      <div className="content">
        <Header />
        <div className="form-container flex column a-center j-center">
          <div className="form flex column a-center j-center">
            <div className="title">
              <h3>Login</h3>
            </div>
            <div className="container flex column">
              <input
                type="email"
                required
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <input
                type="password"
                required
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />

              <button onClick={handleLogin}>Login to your account</button>
              <Link to="/forgotPassword" className="link">
                Forgot your password?
              </Link>
            </div>
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
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
    grid-template-rows: 15vh 85vh;
    .form-container {
      gap: 2rem;
      height: 85vh;
      .form {
        padding: 2rem;
        background-color: #000000b0;
        width: 25vw;
        gap: 2rem;
        color: white;
        .container {
          gap: 2rem;
          input {
            padding: 0.5rem 1rem;
            width: 15rem;
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
    }
  }
`;
