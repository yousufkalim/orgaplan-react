import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Clients from "./Clients";
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
      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}
