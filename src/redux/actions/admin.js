import * as actionTypes from "./actionTypes";

// Sync
export const reset_state = () => {
  localStorage.removeItem("site");
  return {
    type: actionTypes.SET_SITE,
  };
};

export const set_site = (site) => {
  localStorage.setItem("site", JSON.stringify(site));
  return {
    type: actionTypes.SET_SITE,
    site,
  };
};
export const check_site = () => async (dispatch) => {
  try {
    const site = JSON.parse(localStorage.getItem("site"));

    if (site) {
      dispatch(set_site(site));
      return Promise.resolve();
    } else {
      dispatch(reset_state());
      return Promise.resolve();
    }
  } catch (err) {
    dispatch(reset_state());
    return Promise.resolve();
  }
};

export const set_company = (company) => {
  return {
    type: actionTypes.SET_SITE,
    company,
  };
};
