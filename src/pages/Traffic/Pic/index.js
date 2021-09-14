import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Pic from "./PicCanvas";
import DeliveryCalender from "../DeliveryCalender";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.event.match.path + "/"}>
        <Pic drawerOpen={props.drawerOpen} />
      </Route>
      <Route
        exact
        path={props.event.match.path + "/calendar"}
        component={DeliveryCalender}
      />
      <Redirect from="*" to={props.event.match.path + "/"} />
    </Switch>
  );
}
