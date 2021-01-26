import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Home from "./Home";

export default function UnAuth() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Home} />
        <Redirect from="*" to="/" />
      </Switch>
    </>
  );
}
