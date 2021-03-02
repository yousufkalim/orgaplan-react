import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// import AddMean from "./AddMean/AddMean";
// import Mean from "./Means";
import Pic from "./Pic";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/"} component={Pic} />
      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}
