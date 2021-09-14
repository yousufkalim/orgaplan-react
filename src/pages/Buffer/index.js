// Init
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// Pages
import Pic from "./Pic";
import bPlanning from "./Planning";
import bvarificationSheet from "./Planning/components/VerificationSheet";

// Component
export default function BufferIndex(props) {
  return (
    <Switch>
      <Route
        exact
        path="/Plannig/varificationSheet"
        component={bvarificationSheet}
      />
      <Route
        exact
        path="/"
        render={(e) => <Pic event={e} drawerOpen={props.drawerOpen} />}
      />
      <Route exact path="/Planing" component={bPlanning} />
      <Route
        path="/pic-interactive"
        render={(e) => <Pic event={e} drawerOpen={props.drawerOpen} />}
      />
      <Redirect from="*" to="/" />
    </Switch>
  );
}
