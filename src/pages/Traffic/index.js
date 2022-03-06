// Init
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// Pages
import Pic from "./Pic";
import tIncidents from "./Incidents";
import tPlanning from "./Planning";
import varificationSheet from "./Planning/components/VerificationSheet";
import Faq from "../CommonAuth/Faq";

// Component
export default function TrafficIndex(props) {
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={(e) => <Pic event={e} drawerOpen={props.drawerOpen} />}
      />
      <Route
        exact
        path="/Plannig/varificationSheet"
        component={varificationSheet}
      />
      <Route path="/incidents" component={tIncidents} />
      <Route path="/Plannig" component={tPlanning} />
      <Route
        path="/pic-interactive"
        render={(e) => <Pic event={e} drawerOpen={props.drawerOpen} />}
      />
      <Route path="/faq" component={Faq} />
      <Redirect from="*" to="/" />
    </Switch>
  );
}
