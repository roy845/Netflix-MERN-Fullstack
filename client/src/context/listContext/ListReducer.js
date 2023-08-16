const ListReducer = (state, action) => {
  switch (action.type) {
    case "GET_LISTS_START":
      return {
        ...state,
        lists: [],
        isFetching: true,
        error: false,
      };
    case "GET_LISTS_SUCCESS":
      return {
        ...state,
        lists: action.payload,
        isFetching: false,
        error: false,
      };
    case "GET_LISTS_FAILURE":
      return {
        ...state,
        lists: [],
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

    case "GET_LIST_START":
      return {
        ...state,
        list: {},
        isFetching: true,
        error: false,
      };
    case "GET_LIST_SUCCESS":
      return {
        ...state,
        list: action.payload,
        isFetching: false,
        error: false,
      };
    case "GET_LIST_FAILURE":
      return {
        ...state,
        list: {},
        isFetching: false,
        error: true,
      };

    case "CREATE_LIST_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "CREATE_LIST_SUCCESS":
      return {
        lists: [...state.lists, action.payload],
        isFetching: false,
        error: false,
      };
    case "CREATE_LIST_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: true,
      };

    case "GET_RANDOM_LISTS_START":
      return {
        ...state,
        lists: [],
        isFetching: true,
        error: false,
      };
    case "GET_RANDOM_LISTS_SUCCESS":
      return {
        ...state,
        lists: action.payload,
        isFetching: false,
        error: false,
      };
    case "GET_RANDOM_LISTS_FAILURE":
      return {
        ...state,
        lists: [],
        isFetching: false,
        error: true,
      };

    case "DELETE_LIST_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "DELETE_LIST_SUCCESS":
      return {
        lists: state.lists.filter((list) => list._id !== action.payload),
        list: {},
        isFetching: false,
        error: false,
      };
    case "DELETE_LIST_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: true,
      };

    case "UPDATE_LIST_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "UPDATE_LIST_SUCCESS":
      return {
        ...state,
        list: action.payload,
        isFetching: false,
        error: false,
      };
    case "UPDATE_LIST_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    default:
      return { ...state };
  }
};

export default ListReducer;
