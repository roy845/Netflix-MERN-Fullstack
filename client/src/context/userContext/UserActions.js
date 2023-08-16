export const GetUserStatsStart = () => ({
  type: "GET_USER_STATS_START",
});

export const GetUserStatsSuccess = (usersStats) => ({
  type: "GET_USER_STATS_SUCCESS",
  payload: usersStats,
});

export const GetUserStatsfailure = () => ({
  type: "GET_USER_STATS_FAILURE",
});

export const GetNewUsersStatsStart = () => ({
  type: "GET_NEW_USERS_START",
});

export const GetNewUsersSuccess = (newUsers) => ({
  type: "GET_NEW_USERS_SUCCESS",
  payload: newUsers,
});

export const GetNewUsersfailure = () => ({
  type: "GET_NEW_USERS_FAILURE",
});

export const getAllUsersStart = () => ({
  type: "GET_ALL_USERS_START",
});

export const getAllUsersSuccess = (users) => ({
  type: "GET_ALL_USERS_SUCCESS",
  payload: users,
});

export const getAllUsersfailure = () => ({
  type: "GET_ALL_USERS_FAILURE",
});
export const deleteUserStart = () => ({
  type: "DELETE_USER_START",
});

export const deleteUserSuccess = (id) => ({
  type: "DELETE_USER_SUCCESS",
  payload: id,
});

export const deleteUserfailure = () => ({
  type: "DELETE_USER_FAILURE",
});

export const createUserStart = () => ({
  type: "CREATE_USER_START",
});

export const createUserSuccess = (user) => ({
  type: "CREATE_USER_SUCCESS",
  payload: user,
});

export const createUserfailure = () => ({
  type: "CREATE_USER_FAILURE",
});

// export const CreateMovieStart = () => ({
//   type: "CREATE_MOVIE_START",
// });

// export const CreateMovieSuccess = (movie) => ({
//   type: "CREATE_MOVIE_SUCCESS",
//   payload: movie,
// });

// export const CreateMoviefailure = () => ({
//   type: "CREATE_MOVIE_FAILURE",
// });

// export const getMovieStart = () => ({
//   type: "GET_MOVIE_START",
// });

// export const getMovieSuccess = (movie) => ({
//   type: "GET_MOVIE_SUCCESS",
//   payload: movie,
// });

// export const getMoviefailure = () => ({
//   type: "GET_MOVIE_FAILURE",
// });

// export const deleteMovieStart = () => ({
//   type: "DELETE_MOVIE_START",
// });

// export const deleteMovieSuccess = (id) => ({
//   type: "DELETE_MOVIE_SUCCESS",
//   payload: id,
// });

// export const deleteMoviefailure = () => ({
//   type: "DELETE_MOVIE_FAILURE",
// });

// export const updateMovieStart = () => ({
//   type: "UPDATE_MOVIE_START",
// });

// export const updateMovieSuccess = (id) => ({
//   type: "UPDATE_MOVIE_SUCCESS",
//   payload: id,
// });

// export const updateMoviefailure = () => ({
//   type: "UPDATE_MOVIE_FAILURE",
// });
