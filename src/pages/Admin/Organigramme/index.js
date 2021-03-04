import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Organigramme from "./Organigramme";
import AddContact from "./AddContact";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/"} component={Organigramme} />
      <Route
        exact
        path={props.match.path + "/add-contact"}
        component={AddContact}
      />
      {/* <Route exact path={props.match.path + "/zacs"} component={ZACs} /> */}
      {/* <Route exact path={props.match.path + "/add-mean"} component={AddMean} /> */}
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
