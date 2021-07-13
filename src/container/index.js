import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Switch,
  Route,
  Redirect,
  useLocation,
  useHistory,
} from "react-router-dom";
import Actions from "../redux/actions";
import Loader from "../components/Loader";

import Pic from "../pages/Admin/Pic";
import Means from "../pages/Admin/Means";
import Sites from "./Sites.js";
import AddSite from "../pages/Admin/AddSite";
import Calender from "../pages/Admin/Calender";
import Companies from "../pages/Admin/Companies";
import Incidents from "../pages/Admin/Incidents";
import AdminHeader from "../pages/Admin/AdminHeader";
import Organigramme from "../pages/Admin/Organigramme";
// Enterprise Routes
import Main from "../pages/Enterprise";
import eOrganigramme from "../pages/Enterprise/Organigramme";
import ePic from "../pages/Enterprise/Pic";
import eMeans from "../pages/Enterprise/Means";
// TRAFFIC ROUTES
import tPic from "../pages/TRAFFIC/Pic";
import tIncidents from "../pages/TRAFFIC/Incidents";
import tPlanning from "../pages/TRAFFIC/Planning";
import varificationSheet from "../pages/TRAFFIC/Planning/components/VerificationSheet";

// BUFFER ROUTES
import bPic from "../pages/Buffer/Pic";
import bPlanning from "../pages/Buffer/Planning";
import bvarificationSheet from "../pages/Buffer/Planning/components/VerificationSheet";
export default function AdminIndex() {
  const dispatch = useDispatch();
  const location = useLocation();
  let history = useHistory();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (
      location.pathname === "/means/calendar" ||
      location.pathname === "/means/mean-history"
    ) {
      history.push("/means");
    }
    dispatch(Actions.admin.check_site()).then(() => {
      setLoading(false);
    });
    // eslint-disable-next-line
  }, []);
  const store = useSelector((state) => state.admin);

  return (
    <>
      {loading && <Loader.AbsoluteLinear />}
      {loading ? (
        <Loader.CenterProgress />
      ) : !store.site ? (
        <Switch>
          <Route exact path="/" component={Sites} />
          <Route exact path="/add-site" component={AddSite} />
          <Redirect from="*" to="/" />
        </Switch>
      ) : store.site.role == "ADMIN" ? (
        <AdminHeader>
          <Switch>
            <Route exact path="/" component={Calender} />
            <Route path="/companies" component={Companies} />
            <Route path="/incidents" component={Incidents} />
            <Route path="/means" component={Means} />
            <Route path="/pic-interactive" component={Pic} />
            <Route path="/organigramme" component={Organigramme} />
            <Redirect from="*" to="/" />
          </Switch>
        </AdminHeader>
      ) : store.site.role == "ENTERPRISE" ? (
        <AdminHeader>
          <Switch>
            <Route exact path="/" component={ePic} />
            <Route path="/means" component={eMeans} />
            <Route path="/organigramme" component={eOrganigramme} />
            <Route path="/pic-interactive" component={ePic} />
            <Redirect from="*" to="/" />
          </Switch>
        </AdminHeader>
      ) : store.site.role == "TRAFFIC" ? (
        <AdminHeader>
          <Switch>
            <Route exact path="/" component={tPic} />
            <Route
              exact
              path="/Plannig/varificationSheet"
              component={varificationSheet}
            />
            <Route path="/incidents" component={tIncidents} />
            <Route path="/Plannig" component={tPlanning} />
            <Route path="/pic-interactive" component={tPic} />
            <Redirect from="*" to="/" />
          </Switch>
        </AdminHeader>
      ) : (
        <AdminHeader>
          <Switch>
            <Route
              exact
              path="/Plannig/varificationSheet"
              component={bvarificationSheet}
            />
            <Route exact path="/" component={bPic} />
            <Route exact path="/Planing" component={bPlanning} />
            <Route path="/pic-interactive" component={bPic} />
            <Redirect from="*" to="/" />
          </Switch>
        </AdminHeader>
      )}
    </>
  );
}
