// Init
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Faq from "../CommonAuth/Faq";

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
      <Route path="/faq" component={Faq} />
      <Redirect from="*" to="/" />
    </Switch>
  );
}
