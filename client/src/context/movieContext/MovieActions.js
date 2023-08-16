export const getMoviesStart = () => ({
  type: "GET_MOVIES_START",
});

export const getMoviesSuccess = (movies) => ({
  type: "GET_MOVIES_SUCCESS",
  payload: movies,
});

export const getMoviesfailure = () => ({
  type: "GET_MOVIES_FAILURE",
});

export const CreateMovieStart = () => ({
  type: "CREATE_MOVIE_START",
});

export const CreateMovieSuccess = (movie) => ({
  type: "CREATE_MOVIE_SUCCESS",
  payload: movie,
});

export const CreateMoviefailure = () => ({
  type: "CREATE_MOVIE_FAILURE",
});

export const getMovieStart = () => ({
  type: "GET_MOVIE_START",
});

export const getMovieSuccess = (movie) => ({
  type: "GET_MOVIE_SUCCESS",
  payload: movie,
});

export const getMoviefailure = () => ({
  type: "GET_MOVIE_FAILURE",
});

export const deleteMovieStart = () => ({
  type: "DELETE_MOVIE_START",
});

export const deleteMovieSuccess = (id) => ({
  type: "DELETE_MOVIE_SUCCESS",
  payload: id,
});

export const deleteMoviefailure = () => ({
  type: "DELETE_MOVIE_FAILURE",
});

export const updateMovieStart = () => ({
  type: "UPDATE_MOVIE_START",
});

export const updateMovieSuccess = (id) => ({
  type: "UPDATE_MOVIE_SUCCESS",
  payload: id,
});

export const updateMoviefailure = () => ({
  type: "UPDATE_MOVIE_FAILURE",
});

export const getRandomMovieStart = () => ({
  type: "GET_RANDOM_MOVIE_START",
});

export const getRandomMovieSuccess = (randomMovie) => ({
  type: "GET_RANDOM_MOVIE_SUCCESS",
  payload: randomMovie,
});

export const getRandomMoviefailure = () => ({
  type: "GET_RANDOM_MOVIE_FAILURE",
});
