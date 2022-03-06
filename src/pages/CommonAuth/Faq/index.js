import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Faq from "./Faq";
import ViewFaqQuestion from "./ViewFaqQuestion";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/"} component={Faq} />
      <Route
        exact
        path={props.match.path + "/view/:id"}
        component={ViewFaqQuestion}
      />
      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}
