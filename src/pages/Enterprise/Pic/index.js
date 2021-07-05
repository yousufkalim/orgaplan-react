import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Pic from "./PicCanvas";
import DeliveryCalender from "../DeliveryCalender";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/"} component={Pic} />
      <Route
        exact
        path={props.match.path + "/calendar"}
        component={DeliveryCalender}
      />
      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}
