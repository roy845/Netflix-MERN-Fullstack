import {
  GetUserStatsStart,
  GetUserStatsSuccess,
  GetUserStatsfailure,
  GetNewUsersStatsStart,
  GetNewUsersSuccess,
  GetNewUsersfailure,
  getAllUsersStart,
  getAllUsersSuccess,
  getAllUsersfailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserfailure,
  createUserStart,
  createUserSuccess,
  createUserfailure,
  // deleteMovieStart,
  // deleteMovieSuccess,
  // deleteMoviefailure,
  // getMovieStart,
  // getMovieSuccess,
  // getMoviefailure,
  // getMoviesStart,
  // getMoviesSuccess,
  // getMoviesfailure,
  // updateMovieStart,
  // updateMovieSuccess,
  // updateMoviefailure,
} from "./UserActions";

import axios from "axios";

const GET_USER_STATS_URL = "http://localhost:8800/api/users/stats";
const GET_NEW_USERS_URL = "http://localhost:8800/api/users?new=true";
const GET_ALL_USERS_URL = "http://localhost:8800/api/users?new=false";
const DELETE_USER_URL = "http://localhost:8800/api/users/deleteUser/";
const CREATE_USER_URL = "http://localhost:8800/api/auth/register";
// const GET_MOVIE_URL = "http://localhost:8800/api/movies/find/";
// const UPDATE_MOVIE_URL = "http://localhost:8800/api/movies/";
// const DELETE_MOVIE_URL = "http://localhost:8800/api/movies/";
// const CREATE_MOVIE_URL = "http://localhost:8800/api/movies";

//get user stats
export const getUserStats = async (dispatch) => {
  dispatch(GetUserStatsStart());
  try {
    const { data } = await axios.get(GET_USER_STATS_URL);
    dispatch(GetUserStatsSuccess(data));
  } catch (error) {
    dispatch(GetUserStatsfailure());
  }
};

//get new users stats
export const getNewUsers = async (dispatch) => {
  dispatch(GetNewUsersStatsStart());
  try {
    const { data } = await axios.get(GET_NEW_USERS_URL);
    dispatch(GetNewUsersSuccess(data));
  } catch (error) {
    dispatch(GetNewUsersfailure());
  }
};

//get all users stats
export const getAllUsers = async (dispatch) => {
  dispatch(getAllUsersStart());
  try {
    const { data } = await axios.get(GET_ALL_USERS_URL);
    dispatch(getAllUsersSuccess(data));
  } catch (error) {
    dispatch(getAllUsersfailure());
  }
};

//delete user
export const deleteUser = async (dispatch, id) => {
  dispatch(deleteUserStart());
  try {
    const { data } = await axios.delete(`${DELETE_USER_URL}${id}`, {
      headers: {
        Authorization: JSON.parse(localStorage.getItem("auth"))?.token,
      },
    });
    dispatch(deleteUserSuccess(id));
  } catch (error) {
    dispatch(deleteUserfailure());
  }
};
//create user
export const createUser = async (dispatch, email, username, password) => {
  dispatch(createUserStart());
  try {
    const { data } = await axios.post(
      `${CREATE_USER_URL}`,
      { email, username, password },
      {
        headers: {
          Authorization: JSON.parse(localStorage.getItem("auth"))?.token,
        },
      }
    );
    dispatch(createUserSuccess(data.user));
  } catch (error) {
    dispatch(createUserfailure());
  }
};

// //get movie
// export const getMovie = async (id, dispatch) => {
//   dispatch(getMovieStart());
//   try {
//     const { data } = await axios.get(`${GET_MOVIE_URL}${id}`);
//     dispatch(getMovieSuccess(data));
//   } catch (error) {
//     dispatch(getMoviefailure());
//   }
// };

// //update movie
// export const updateMovie = async (id, formData, dispatch) => {
//   dispatch(updateMovieStart());
//   try {
//     const { data } = await axios.put(`${UPDATE_MOVIE_URL}${id}`, formData);
//     dispatch(updateMovieSuccess(data));
//   } catch (error) {
//     dispatch(updateMoviefailure());
//   }
// };

// //delete movie
// export const deleteMovie = async (id, dispatch) => {
//   dispatch(deleteMovieStart());
//   try {
//     const { data } = await axios.delete(`${DELETE_MOVIE_URL}${id}`);
//     dispatch(deleteMovieSuccess(id));
//   } catch (error) {
//     dispatch(deleteMoviefailure());
//   }
// };

// //create movie
// export const createMovie = async (movie, dispatch) => {
//   dispatch(CreateMovieStart());
//   try {
//     const { data } = await axios.post(`${CREATE_MOVIE_URL}`, movie);
//     dispatch(CreateMovieSuccess(data));
//   } catch (error) {
//     dispatch(CreateMoviefailure());
//   }
// };
