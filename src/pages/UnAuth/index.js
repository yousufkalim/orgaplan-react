import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Login from "./Login";
import Landing from "./Landing";

export default function UnAuth() {
  return (
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route exact path="/login" component={Login} />
      <Redirect from="*" to="/" />
    </Switch>
  );
}
