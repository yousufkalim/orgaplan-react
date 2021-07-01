import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Mean from "./Means";

// import MeanCalender from "../MeanCalender";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/"} component={Mean} />
      {/* <Route
        exact
        path={props.match.path + "/calendar"}
        component={MeanCalender}
      /> */}

      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}
