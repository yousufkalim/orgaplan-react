// init
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// Pages
import eOrganigramme from "./Organigramme";
import Pic from "./Pic";
import eMeans from "./Means";
import Faq from "../CommonAuth/Faq";

// Component
export default function EnterpriseIndex(props) {
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={(e) => <Pic event={e} drawerOpen={props.drawerOpen} />}
      />
      <Route path="/means" component={eMeans} />
      <Route path="/organigramme" component={eOrganigramme} />
      <Route
        path="/pic-interactive"
        render={(e) => <Pic event={e} drawerOpen={props.drawerOpen} />}
      />
      <Route path="/faq" component={Faq} />
      <Redirect from="*" to="/" />
    </Switch>
  );
}
