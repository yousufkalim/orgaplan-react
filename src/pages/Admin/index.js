import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Switch,
  Route,
  Redirect,
  useLocation,
  useHistory,
} from "react-router-dom";
import Actions from "../../redux/actions";
import Loader from "../../components/Loader";

import Pic from "./Pic";
import Means from "./Means";
import Sites from "./Sites.js";
import AddSite from "./AddSite";
import Calender from "./Calender";
import Companies from "./Companies";
import Incidents from "./Incidents";
import AdminHeader from "./AdminHeader";
import Organigramme from "./Organigramme";
// Enterprise Routes
import Main from "./Enterprise";

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
      ) : (
        <AdminHeader>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route path="/organigramme" component={Organigramme} />
            <Redirect from="*" to="/" />
          </Switch>
        </AdminHeader>
      )}
    </>
  );
}
