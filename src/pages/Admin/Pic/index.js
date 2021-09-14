import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// import Pic from "./Pic";
import Pic from "./PicCanvas";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.event.match.path + "/"}>
        <Pic drawerOpen={props.drawerOpen} />
      </Route>
      <Redirect from="*" to={props.event.match.path + "/"} />
    </Switch>
  );
}
