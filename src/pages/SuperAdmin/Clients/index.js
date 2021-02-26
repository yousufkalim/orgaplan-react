import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Clients from "./Clients";
import Invoices from "./Invoices";
import AddClient from "./AddClient";
import AddInvoice from "./AddInvoice";
import VerifyClient from "./VerifyClient";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/"} component={Clients} />
      <Route
        exact
        component={AddClient}
        path={props.match.path + "/add-client"}
      />
      <Route
        exact
        component={VerifyClient}
        path={props.match.path + "/verify-client"}
      />
      <Route
        exact
        component={Invoices}
        path={props.match.path + "/invoices/:clientId"}
      />
      <Route
        exact
        component={AddInvoice}
        path={props.match.path + "/add-invoice"}
      />
      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}
