import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import Calender from "./Calender";
import Comapnies from "./Companies/Companies";
import Incidents from "./Incidents/Incidents";
import Invoices from "./Invoices/Invoices";
import Means from "./Means/Means";
import Organigramme from "./Organigramme/Organigramme";
import Pic from "./Pic/Pic";

import Home from "./Home";

export default function UnAuth() {
  return (
    <>
      <AdminHeader>
        <Switch>
          <Route exact path="/" component={Calender} />
          <Route exact path="/calender" component={Calender} />
          <Route exact path="/comapnies" component={Comapnies} />
          <Route exact path="/incidents" component={Incidents} />
          <Route exact path="/invoices" component={Invoices} />
          <Route exact path="/means" component={Means} />
          <Route exact path="/organigramme" component={Organigramme} />
          <Route exact path="/pic-interactive" component={Pic} />
          <Redirect from="*" to="/" />
        </Switch>
      </AdminHeader>
    </>
  );
}
