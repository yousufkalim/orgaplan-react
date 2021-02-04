import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import ZACs from "./ZACs";
import Sites from "./Sites";
import AddSite from "./AddSite";
import ArchivedSites from "./ArchivedSites";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/"} component={Sites} />
      <Route exact path={props.match.path + "/zacs"} component={ZACs} />
      <Route exact path={props.match.path + "/add-site"} component={AddSite} />
      <Route
        exact
        path={props.match.path + "/archives"}
        component={ArchivedSites}
      />
      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}
