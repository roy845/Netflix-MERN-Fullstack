import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "./AuthActions";

const LOGIN_URL = "http://localhost:8800/api/auth/login";

export const login = async (user, dispatch) => {
  dispatch(loginStart);

  try {
    const { data } = await axios.post(LOGIN_URL, user, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFailure());
  }
};
