import { useState, useContext, createContext } from "react";
import axios from "axios";

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
  const [isLoading, setIsLoading] = useState(false);

  axios.defaults.headers.common["Authorization"] = auth?.token;

  return (
    <AuthContext.Provider value={{ auth, setAuth, isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

//custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
