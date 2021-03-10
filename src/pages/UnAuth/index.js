import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Login from "./Login";
import Header from "./UnAuthHeader";
import LandingPage from "./LandingPage";
import ForgotPassword from "./ForgotPassword";
import CompleteRegistration from "./CompleteRegistration";

export default function UnAuth() {
  return (
    <Header>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/password-forgot" component={ForgotPassword} />
        <Route
          exact
          path="/email-verification"
          component={CompleteRegistration}
        />
        <Redirect from="*" to="/" />
      </Switch>
    </Header>
  );
}
