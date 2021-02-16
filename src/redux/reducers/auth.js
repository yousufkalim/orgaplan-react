import * as actionTypes from "../actions/actionTypes";
import storeUtility from "../utility";

const initialState = {
  loading: false,
  auth: true,
  user: "",
  token: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return storeUtility.updateObject(state, action);
    case actionTypes.ON_LOGIN:
      return storeUtility.updateObject(state, action);
    case actionTypes.ON_LOGOUT:
      return storeUtility.updateObject(state, action);
    case actionTypes.SET_USER:
      return storeUtility.updateObject(state, { user: action.user });
    default:
      return state;
  }
};

export default reducer;
