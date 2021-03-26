import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AddMean from "./AddMean";
import Mean from "./Means";
import EditMean from "./EditMean";
import Historic from "./Historic";
import MeanCalender from "../MeanCalender";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/"} component={Mean} />
      <Route exact path={props.match.path + "/add-mean"} component={AddMean} />
      <Route
        exact
        path={props.match.path + "/calendar"}
        component={MeanCalender}
      />
      <Route
        exact
        path={props.match.path + "/edit-mean"}
        component={EditMean}
      />
      <Route
        exact
        path={props.match.path + "/mean-history"}
        component={Historic}
      />
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
