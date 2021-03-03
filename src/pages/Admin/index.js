import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import Calender from "./Calender";
import Companies from "./Companies";
import Incidents from "./Incidents/Incidents";
import Invoices from "./Invoices/Invoices";
import Means from "./Means";
import Organigramme from "./Organigramme";
import Pic from "./Pic"

export default function UnAuth() {
  return (
    <>
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
    </>
  );
}
