export const getListsStart = () => ({
  type: "GET_LISTS_START",
});

export const getListsSuccess = (lists) => ({
  type: "GET_LISTS_SUCCESS",
  payload: lists,
});

export const getListsfailure = () => ({
  type: "GET_LISTS_FAILURE",
});

export const createListStart = () => ({
  type: "CREATE_LIST_START",
});

export const createListSuccess = (list) => ({
  type: "CREATE_LIST_SUCCESS",
  payload: list,
});

export const createListFailure = () => ({
  type: "CREATE_LIST_FAILURE",
});

export const getListStart = () => ({
  type: "GET_LIST_START",
});

export const getListSuccess = (list) => ({
  type: "GET_LIST_SUCCESS",
  payload: list,
});

export const getListfailure = () => ({
  type: "GET_LIST_FAILURE",
});

export const deleteListStart = () => ({
  type: "DELETE_LIST_START",
});

export const deleteListSuccess = (id) => ({
  type: "DELETE_LIST_SUCCESS",
  payload: id,
});

export const deleteListfailure = () => ({
  type: "DELETE_LIST_FAILURE",
});

export const updateListStart = () => ({
  type: "UPDATE_LIST_START",
});

export const updateListSuccess = (id) => ({
  type: "UPDATE_LIST_SUCCESS",
  payload: id,
});

export const updateListfailure = () => ({
  type: "UPDATE_LIST_FAILURE",
});

export const getRandomListsStart = () => ({
  type: "GET_RANDOM_LISTS_START",
});

export const getRandomListsSuccess = (id) => ({
  type: "GET_RANDOM_LISTS_SUCCESS",
  payload: id,
});

export const getRandomListsfailure = () => ({
  type: "GET_RANDOM_LISTS_FAILURE",
});
