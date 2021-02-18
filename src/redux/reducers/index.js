import { combineReducers } from "redux";

import auth from "./auth";
import notistack from "./notistack";

export default combineReducers({ auth, notistack });
