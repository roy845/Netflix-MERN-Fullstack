import MovieReducer from "./MovieReducer";
import { createContext, useReducer, useState } from "react";
import axios from "axios";

const Initial_State = {
  movies: [],
  movie: {},
  randomMovie: [],
  isFetching: false,
  error: false,
};

export const MovieContext = createContext(Initial_State);

export const MovieContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(MovieReducer, Initial_State);
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));

  // axios.defaults.headers.common["Authorization"] = auth?.token;

  return (
    <MovieContext.Provider
      value={{
        movies: state.movies,
        movie: state.movie,
        randomMovie: state.randomMovie,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
