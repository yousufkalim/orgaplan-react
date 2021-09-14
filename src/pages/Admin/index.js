// Init
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// Pages
import Pic from "./Pic";
import Means from "./Means";
import Calender from "./Calender";
import Companies from "./Companies";
import Incidents from "./Incidents";
import Organigramme from "./Organigramme";

// Component
export default function AdminIndex(props) {
  return (
    <Switch>
      <Route exact path="/" component={Calender} />
      <Route path="/companies" component={Companies} />
      <Route path="/incidents" component={Incidents} />
      <Route path="/means" component={Means} />
      <Route
        path="/pic-interactive"
        render={(e) => <Pic event={e} drawerOpen={props.drawerOpen} />}
      />
      <Route path="/organigramme" component={Organigramme} />
      <Redirect from="*" to="/" />
    </Switch>
  );
}
