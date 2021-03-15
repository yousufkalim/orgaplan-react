import { combineReducers } from "redux";

import auth from "./auth";
import admin from "./admin";
import notistack from "./notistack";

export default combineReducers({ auth, admin, notistack });
