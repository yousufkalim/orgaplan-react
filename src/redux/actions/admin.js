import * as actionTypes from "./actionTypes";
import GLOBALS from "../../globals";

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
      // Getting latest site data from api
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_ONE_SITE}/${site.siteId._id}`,
      });

      // Making object according to local storage
      const res = { siteId: result.data, role: site.role };
      dispatch(set_site(res));
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
