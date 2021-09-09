// Init
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

// Pages
import AdminIndex from "../pages/Admin";
import EnterpriseIndex from "../pages/Enterprise";
import TrafficIndex from "../pages/Traffic";
import BufferIndex from "../pages/Buffer";
import Sites from "../components/Sites.js";
import AddSite from "../pages/Admin/AddSite";
import SiteHeader from "../components/SiteHeader";

// Routes
export default function SiteRoutes() {
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
      ) : store.site.role === "ADMIN" ? (
        <SiteHeader>
          <AdminIndex />
        </SiteHeader>
      ) : store.site.role === "ENTERPRISE" ? (
        <SiteHeader>
          <EnterpriseIndex />
        </SiteHeader>
      ) : store.site.role === "TRAFFIC" ? (
        <SiteHeader>
          <TrafficIndex />
        </SiteHeader>
      ) : (
        <SiteHeader>
          <BufferIndex />
        </SiteHeader>
      )}
    </>
  );
}
