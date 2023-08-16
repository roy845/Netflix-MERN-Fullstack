const MovieReducer = (state, action) => {
  switch (action.type) {
    case "GET_MOVIES_START":
      return {
        ...state,
        movies: [],
        isFetching: true,
        error: false,
      };
    case "GET_MOVIES_SUCCESS":
      return {
        ...state,
        movies: action.payload,
        isFetching: false,
        error: false,
      };
    case "GET_MOVIES_FAILURE":
      return {
        ...state,
        movies: [],
        isFetching: false,
        error: true,
      };

    case "CREATE_MOVIE_START":
      return {
        ...state,

        isFetching: true,
        error: false,
      };
    case "CREATE_MOVIE_SUCCESS":
      return {
        ...state,
        movies: [...state.movies, action.payload],
        isFetching: false,
        error: false,
      };
    case "CREATE_MOVIE_FAILURE":
      return {
        ...state,
        movies: [],
        isFetching: false,
        error: true,
      };

    case "GET_MOVIE_START":
      return {
        ...state,
        movie: {},
        isFetching: true,
        error: false,
      };
    case "GET_MOVIE_SUCCESS":
      return {
        ...state,
        movie: action.payload,
        isFetching: false,
        error: false,
      };
    case "GET_MOVIE_FAILURE":
      return {
        ...state,
        movie: {},
        isFetching: false,
        error: true,
      };

    case "DELETE_MOVIE_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "DELETE_MOVIE_SUCCESS":
      return {
        movies: state.movies.filter((movie) => movie._id !== action.payload),
        movie: {},
        isFetching: false,
        error: false,
      };
    case "DELETE_MOVIE_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: true,
      };

    case "UPDATE_MOVIE_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "UPDATE_MOVIE_SUCCESS":
      return {
        ...state,
        movie: action.payload,
        isFetching: false,
        error: false,
      };
    case "UPDATE_MOVIE_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: true,
      };

    case "GET_RANDOM_MOVIE_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "GET_RANDOM_MOVIE_SUCCESS":
      return {
        ...state,
        randomMovie: action.payload,
        isFetching: false,
        error: false,
      };
    case "GET_RANDOM_MOVIE_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: true,
      };

    default:
      return { ...state };
  }
};

export default MovieReducer;
