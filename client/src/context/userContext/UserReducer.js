const UserReducer = (state, action) => {
  switch (action.type) {
    case "GET_USER_STATS_START":
      return {
        ...state,
        usersStats: [],
        isFetching: true,
        error: false,
      };
    case "GET_USER_STATS_SUCCESS":
      return {
        ...state,
        usersStats: action.payload,
        isFetching: false,
        error: false,
      };
    case "GET_USER_STATS_FAILURE":
      return {
        ...state,
        usersStats: [],
        isFetching: false,
        error: true,
      };

    case "GET_NEW_USERS_START":
      return {
        ...state,
        newUsers: [],
        isFetching: true,
        error: false,
      };
    case "GET_NEW_USERS_SUCCESS":
      return {
        ...state,
        newUsers: action.payload,
        isFetching: false,
        error: false,
      };
    case "GET_NEW_USERS_FAILURE":
      return {
        ...state,
        newUsers: [],
        isFetching: false,
        error: true,
      };

    case "GET_ALL_USERS_START":
      return {
        ...state,
        users: [],
        isFetching: true,
        error: false,
      };
    case "GET_ALL_USERS_SUCCESS":
      return {
        ...state,
        users: action.payload,
        isFetching: false,
        error: false,
      };
    case "GET_ALL_USERS_FAILURE":
      return {
        ...state,
        users: [],
        isFetching: false,
        error: true,
      };

    case "DELETE_USER_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "DELETE_USER_SUCCESS":
      return {
        users: state.users.filter((user) => user._id !== action.payload),
        isFetching: false,
        error: false,
      };
    case "DELETE_USER_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    case "CREATE_USER_START":
      return {
        ...state,

        isFetching: true,
        error: false,
      };
    case "CREATE_USER_SUCCESS":
      return {
        ...state,
        users: [...state.users, action.payload],
        isFetching: false,
        error: false,
      };
    case "CREATE_USER_FAILURE":
      return {
        ...state,
        users: [],
        isFetching: false,
        error: true,
      };

    // case "CREATE_MOVIE_START":
    //   return {
    //     ...state,

    //     isFetching: true,
    //     error: false,
    //   };
    // case "CREATE_MOVIE_SUCCESS":
    //   return {
    //     ...state,
    //     movies: [...state.movies, action.payload],
    //     isFetching: false,
    //     error: false,
    //   };
    // case "CREATE_MOVIE_FAILURE":
    //   return {
    //     ...state,
    //     movies: [],
    //     isFetching: false,
    //     error: true,
    //   };

    // case "GET_MOVIE_START":
    //   return {
    //     ...state,
    //     movie: {},
    //     isFetching: true,
    //     error: false,
    //   };
    // case "GET_MOVIE_SUCCESS":
    //   return {
    //     ...state,
    //     movie: action.payload,
    //     isFetching: false,
    //     error: false,
    //   };
    // case "GET_MOVIE_FAILURE":
    //   return {
    //     ...state,
    //     movie: {},
    //     isFetching: false,
    //     error: true,
    //   };

    // case "DELETE_MOVIE_START":
    //   return {
    //     ...state,
    //     isFetching: true,
    //     error: false,
    //   };
    // case "DELETE_MOVIE_SUCCESS":
    //   return {
    //     movies: state.movies.filter((movie) => movie._id !== action.payload),
    //     movie: {},
    //     isFetching: false,
    //     error: false,
    //   };
    // case "DELETE_MOVIE_FAILURE":
    //   return {
    //     ...state,
    //     isFetching: false,
    //     error: true,
    //   };

    // case "UPDATE_MOVIE_START":
    //   return {
    //     ...state,
    //     isFetching: true,
    //     error: false,
    //   };
    // case "UPDATE_MOVIE_SUCCESS":
    //   return {
    //     ...state,
    //     movie: action.payload,
    //     isFetching: false,
    //     error: false,
    //   };
    // case "UPDATE_MOVIE_FAILURE":
    //   return {
    //     ...state,
    //     isFetching: false,
    //     error: true,
    //   };
    default:
      return { ...state };
  }
};

export default UserReducer;
