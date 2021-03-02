import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AddMean from "./AddMean/AddMean";
import Mean from "./Means";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/"} component={Mean} />
      <Route exact path={props.match.path + "/add-mean"} component={AddMean} />
      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}
