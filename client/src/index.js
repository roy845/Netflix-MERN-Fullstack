import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/authContext/AuthContext";
import { MovieContextProvider } from "./context/movieContext/MovieContext";
import { ListContextProvider } from "./context/listContext/ListContext";
import { UserContextProvider } from "./context/userContext/UserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <AuthProvider>
      <MovieContextProvider>
        <ListContextProvider>
          <UserContextProvider>
            <App />
          </UserContextProvider>
        </ListContextProvider>
        <Toaster />
      </MovieContextProvider>
    </AuthProvider>
  </Router>
);
