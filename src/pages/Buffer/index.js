// Init
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// Pages
import bPic from "./Pic";
import bPlanning from "./Planning";
import bvarificationSheet from "./Planning/components/VerificationSheet";

// Component
export default function BufferIndex() {
  return (
    <Switch>
      <Route
        exact
        path="/Plannig/varificationSheet"
        component={bvarificationSheet}
      />
      <Route exact path="/" component={bPic} />
      <Route exact path="/Planing" component={bPlanning} />
      <Route path="/pic-interactive" component={bPic} />
      <Redirect from="*" to="/" />
    </Switch>
  );
}
