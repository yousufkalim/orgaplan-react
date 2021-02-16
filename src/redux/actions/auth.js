import * as actionTypes from "./actionTypes";

import GLOBALS from "../../globals";

// Sync
export const set_loading = (action) => {
  return {
    type: actionTypes.SET_LOADING,
    payload: {
      loading: action,
    },
  };
};

export const set_login = (user, token) => {
  localStorage.setItem("orgaplan", token);
  return {
    type: actionTypes.SET_LOGIN,
    payload: {
      auth: true,
      user: user,
      token: token,
    },
  };
};

export const set_logout = () => {
  localStorage.removeItem("orgaplan");
  return {
    type: actionTypes.SET_LOGOUT,
    payload: {
      auth: false,
      user: "",
      token: "",
    },
  };
};

export const set_user = (user) => {
  return (dispatch) => ({
    type: actionTypes.SET_USER,
    payload: {
      user: user,
    },
  });
};

// Async
export const auth = (email, password) => {
  return (dispatch) => {
    dispatch(set_loading(true));

    GLOBALS.API({
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((result) => {
        dispatch(set_login(result.data.user, result.data.token));
        dispatch(set_loading(false));
      })
      .catch((err) => dispatch(set_loading(false)));
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("orgaplan");
    if (!token) {
      dispatch(set_logout());
    } else {
      GLOBALS.API({
        uri: GLOBALS.Constants.GET_PROFILE,
        token: token,
      })
        .then((result) => {
          dispatch(set_login(result.data.user, result.data.token));
          dispatch(set_loading(false));
        })
        .catch((err) => dispatch(set_loading(false)));
    }
  };
};
