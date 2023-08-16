import ListReducer from "./ListReducer";
import { createContext, useReducer, useState } from "react";
import axios from "axios";

const Initial_State = {
  lists: [],
  list: {},
  isFetching: false,
  error: false,
};

export const ListContext = createContext(Initial_State);

export const ListContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ListReducer, Initial_State);
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));

  // axios.defaults.headers.common["Authorization"] = auth?.token;

  return (
    <ListContext.Provider
      value={{
        lists: state.lists,
        list: state.list,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
