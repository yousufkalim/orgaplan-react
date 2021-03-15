import React from "react";
import { useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";

import Pic from "./Pic";
import Means from "./Means";
import Sites from "./Sites.js";
import Calender from "./Calender";
import Companies from "./Companies";
import Incidents from "./Incidents";
import AdminHeader from "./AdminHeader";
import Organigramme from "./Organigramme";
import Invoices from "./Invoices/Invoices";

export default function AdminIndex() {
  const store = useSelector((state) => state.admin);

  return !store.site ? (
    <Switch>
      <Route exact path="/" component={Sites} />
      <Redirect from="*" to="/" />
    </Switch>
  ) : (
    <AdminHeader>
      <Switch>
        <Route exact path="/" component={Calender} />
        <Route path="/calender" component={Calender} />
        <Route path="/companies" component={Companies} />
        <Route path="/incidents" component={Incidents} />
        <Route path="/invoices" component={Invoices} />
        <Route path="/means" component={Means} />
        <Route path="/pic-interactive" component={Pic} />
        <Route path="/organigramme" component={Organigramme} />
        <Redirect from="*" to="/" />
      </Switch>
    </AdminHeader>
  );
}
