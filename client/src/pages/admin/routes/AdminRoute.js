import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/authContext/AuthContext";
import LoadingSpinner from "../../../components/spinner/Spinner";
const AUTH_URL = "http://localhost:8800/api/auth/admin-auth";

export default function AdminRoute() {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const { auth } = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const { data } = await axios.get(`${AUTH_URL}`);

        if (data.ok) {
          setOk(data.ok);
        } else {
          setOk(data.ok);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setOk(false); // Set ok to false in case of error
      } finally {
        setLoading(false); // Set loading to false after API call
      }
    };

    if (auth?.token) {
      authCheck();
    } else {
      setOk(false); // Set ok to false if auth token is not available
      setLoading(false); // Set loading to false if auth token is not available
    }
  }, [auth?.token]);

  // Render loading state if still loading
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect to Outlet component when ok is true
  if (ok) {
    return <Outlet />;
  } else {
    // Redirect to "/" when ok is false
    return <Navigate to="/" />;
  }
}
