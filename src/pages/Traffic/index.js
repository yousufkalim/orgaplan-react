// Init
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// Pages
import tPic from "./Pic";
import tIncidents from "./Incidents";
import tPlanning from "./Planning";
import varificationSheet from "./Planning/components/VerificationSheet";

// Component
export default function TrafficIndex() {
  return (
    <Switch>
      <Route exact path="/" component={tPic} />
      <Route
        exact
        path="/Plannig/varificationSheet"
        component={varificationSheet}
      />
      <Route path="/incidents" component={tIncidents} />
      <Route path="/Plannig" component={tPlanning} />
      <Route path="/pic-interactive" component={tPic} />
      <Redirect from="*" to="/" />
    </Switch>
  );
}
