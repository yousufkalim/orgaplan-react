// init
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// Pages
import eOrganigramme from "./Organigramme";
import ePic from "./Pic";
import eMeans from "./Means";

// Component
export default function EnterpriseIndex() {
  return (
    <Switch>
      <Route exact path="/" component={ePic} />
      <Route path="/means" component={eMeans} />
      <Route path="/organigramme" component={eOrganigramme} />
      <Route path="/pic-interactive" component={ePic} />
      <Redirect from="*" to="/" />
    </Switch>
  );
}
