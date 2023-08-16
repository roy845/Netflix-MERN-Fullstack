import {
  createListFailure,
  createListStart,
  createListSuccess,
  deleteListStart,
  deleteListSuccess,
  deleteListfailure,
  getListStart,
  getListSuccess,
  getListfailure,
  updateListStart,
  updateListSuccess,
  updateListfailure,
  getListsStart,
  getListsSuccess,
  getListsfailure,
  getRandomListsStart,
  getRandomListsSuccess,
  getRandomListsfailure,
} from "./ListActions";

import axios from "axios";

const GET_LISTS_URL = "http://localhost:8800/api/lists";
const GET_LIST_URL = "http://localhost:8800/api/lists/";
const UPDATE_LIST_URL = "http://localhost:8800/api/lists/";
const DELETE_LIST_URL = "http://localhost:8800/api/lists/";
const GET_RAMDOM_LISTS = "http://localhost:8800/api/lists";
const CREATE_LIST_URL = "http://localhost:8800/api/lists";

//get all lists
export const getLists = async (dispatch) => {
  dispatch(getListsStart());
  try {
    const { data } = await axios.get(GET_LISTS_URL);
    dispatch(getListsSuccess(data));
  } catch (error) {
    dispatch(getListsfailure());
  }
};

//get list
export const getList = async (id, dispatch) => {
  dispatch(getListStart());
  try {
    const { data } = await axios.get(`${GET_LIST_URL}${id}`);
    console.log(data);
    dispatch(getListSuccess(data));
  } catch (error) {
    dispatch(getListfailure());
  }
};

//update list
export const updateList = async (id, formData, dispatch) => {
  dispatch(updateListStart());
  try {
    const { data } = await axios.put(`${UPDATE_LIST_URL}${id}`, formData);
    dispatch(updateListSuccess(data));
  } catch (error) {
    dispatch(updateListfailure());
  }
};

//delete list
export const deleteList = async (id, dispatch) => {
  dispatch(deleteListStart());
  try {
    await axios.delete(`${DELETE_LIST_URL}${id}`);
    dispatch(deleteListSuccess(id));
  } catch (error) {
    dispatch(deleteListfailure());
  }
};

//get random lists
export const getRandomLists = async (type, genre, dispatch) => {
  dispatch(getRandomListsStart());
  try {
    const { data } = await axios.get(
      `${GET_RAMDOM_LISTS}${type ? "?type=" + type : ""}${
        genre ? "&genre=" + genre : ""
      }`
    );
    dispatch(getRandomListsSuccess(data));
  } catch (error) {
    dispatch(getRandomListsfailure());
  }
};

//create list
export const createList = async (list, dispatch) => {
  dispatch(createListStart());
  try {
    const { data } = await axios.post(`${CREATE_LIST_URL}`, list);
    dispatch(createListSuccess(data));
  } catch (error) {
    dispatch(createListFailure());
  }
};
