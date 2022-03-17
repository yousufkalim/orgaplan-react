import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import CreateQuestion from "./CreateQuestion";
import UpdateQuestion from "./UpdateQuestion";
import ViewQuestion from "./ViewQuestion";

import Questions from "./Questions";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/"} component={Questions} />
      <Route
        exact
        path={props.match.path + "/create"}
        component={CreateQuestion}
      />
      <Route
        exact
        path={props.match.path + "/edit/:id"}
        component={UpdateQuestion}
      />
      <Route
        exact
        path={props.match.path + "/view/:id"}
        component={ViewQuestion}
      />
      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}
