import {
  CreateMovieStart,
  CreateMovieSuccess,
  CreateMoviefailure,
  deleteMovieStart,
  deleteMovieSuccess,
  deleteMoviefailure,
  getMovieStart,
  getMovieSuccess,
  getMoviefailure,
  getMoviesStart,
  getMoviesSuccess,
  getMoviesfailure,
  updateMovieStart,
  updateMovieSuccess,
  updateMoviefailure,
  getRandomMovieStart,
  getRandomMovieSuccess,
  getRandomMoviefailure,
} from "./MovieActions";

import axios from "axios";

const GET_MOVIES_URL = "http://localhost:8800/api/movies/media";
const GET_MOVIE_URL = "http://localhost:8800/api/movies/find/";
const UPDATE_MOVIE_URL = "http://localhost:8800/api/movies/";
const DELETE_MOVIE_URL = "http://localhost:8800/api/movies/";
const CREATE_MOVIE_URL = "http://localhost:8800/api/movies";
const GET_RANDOM_MOVIE_URL = "http://localhost:8800/api/movies/random?type=";

//get all movies
export const getMovies = async (dispatch) => {
  dispatch(getMoviesStart());
  try {
    const { data } = await axios.get(GET_MOVIES_URL);
    dispatch(getMoviesSuccess(data));
  } catch (error) {
    dispatch(getMoviesfailure());
  }
};

//get movie
export const getMovie = async (id, dispatch) => {
  dispatch(getMovieStart());
  try {
    const { data } = await axios.get(`${GET_MOVIE_URL}${id}`);
    dispatch(getMovieSuccess(data));
  } catch (error) {
    dispatch(getMoviefailure());
  }
};

//update movie
export const updateMovie = async (id, formData, dispatch) => {
  dispatch(updateMovieStart());
  try {
    const { data } = await axios.put(`${UPDATE_MOVIE_URL}${id}`, formData);
    dispatch(updateMovieSuccess(data));
  } catch (error) {
    dispatch(updateMoviefailure());
  }
};

//delete movie
export const deleteMovie = async (id, uId, dispatch) => {
  dispatch(deleteMovieStart());
  try {
    const { data } = await axios.delete(`${DELETE_MOVIE_URL}${id}/${uId}`);
    dispatch(deleteMovieSuccess(id));
  } catch (error) {
    dispatch(deleteMoviefailure());
  }
};

//create movie
export const createMovie = async (movie, dispatch) => {
  dispatch(CreateMovieStart());
  try {
    const { data } = await axios.post(`${CREATE_MOVIE_URL}`, movie);
    dispatch(CreateMovieSuccess(data));
  } catch (error) {
    dispatch(CreateMoviefailure());
  }
};

//get random movie
export const getRandomMovie = async (dispatch, type) => {
  dispatch(getRandomMovieStart());
  try {
    const { data } = await axios.get(`${GET_RANDOM_MOVIE_URL}${type}`);
    dispatch(getRandomMovieSuccess(data));
  } catch (error) {
    dispatch(getRandomMoviefailure());
  }
};
