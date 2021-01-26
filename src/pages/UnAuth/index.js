import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Login from "./Login";
import LandingPage from "./LandingPage";
import ForgotPassword from "./ForgotPassword";

export default function UnAuth() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/password-forgot" component={ForgotPassword} />
        <Redirect from="*" to="/" />
      </Switch>
    </>
  );
}
