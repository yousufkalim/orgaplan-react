import * as actionTypes from "./actionTypes";
import GLOBALS from "../../globals";

export const on_loading = () => ({
  type: actionTypes.SET_LOADING,
  payload: {
    isLoading: true,
  },
});

export const postDataResult = (data) => ({
  type: actionTypes.POST_DATA,
  payload: {
    data,
    isLoading: false,
  },
});

export const onApiError = (error) => ({
  type: actionTypes.SET_ERROR,
  payload: {
    error,
    isLoading: false,
  },
});

export const postData = (endpoint, body) => {
  return async (dispatch) => {
    // nameless functions
    // Initial action dispatched
    dispatch(on_loading());
    // Return promise with success and failure actions

    const response = await GLOBALS.API({
      method: "POST",
      uri: endpoint,
      body: JSON.stringify(body),
    });
    if (response.success) dispatch(postDataResult(response));
    else dispatch(onApiError(response));
  };
};
