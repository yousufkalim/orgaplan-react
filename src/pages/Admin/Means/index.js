import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AddMean from "./AddMean";
import Mean from "./Means";
import EditMean from "./EditMean";
import Historic from "./Historic";

// import ZACs from "./ZACs";
// import Sites from "./Sites";
// import AddZAC from "./AddZAC";
// import AddSite from "./AddSite";
// import ArchivedSites from "./ArchivedSites";

export default function Index(props) {
  console.log(props.match.path + "/add-mean")
  return (
    <Switch>
      {console.log(props.match.path)}
      <Route exact path={props.match.path + "/"} component={Mean} />
      {/* <Route exact path={props.match.path + "/zacs"} component={ZACs} /> */}
      <Route exact path={props.match.path + "/add-mean"} component={AddMean} />
      <Route exact path={props.match.path + "/edit-mean"} component={EditMean} />
      {/* <Route exact path={props.match.path + "/add-site"} component={AddSite} /> */}
      {/* <Route
        exact
        path={props.match.path + "/archives"}
        component={ArchivedSites}
      /> */}
      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}
