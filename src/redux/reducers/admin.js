import * as actionTypes from "../actions/actionTypes";
import storeUtility from "../utility";

const initialState = {
  site: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_SITE:
      return storeUtility.updateObject(state, {
        site: action.site,
      });

    default:
      return state;
  }
};

export default reducer;
