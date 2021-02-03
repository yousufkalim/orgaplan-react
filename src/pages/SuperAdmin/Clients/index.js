import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Clients from "./Clients";
import Invoices from "./Invoices";
import AddClient from "./AddClient";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/"} component={Clients} />
      <Route
        exact
        path={props.match.path + "/add-client"}
        component={AddClient}
      />
      <Route exact path={props.match.path + "/invoices"} component={Invoices} />
      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}
