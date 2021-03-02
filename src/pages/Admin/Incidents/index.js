import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Incidents from "./Incidents";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/"} component={Incidents} />
      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}
