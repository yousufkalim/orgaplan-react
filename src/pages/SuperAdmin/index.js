import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Home from "./Home";
import Clients from "./Clients";
import Sites from "./Sites";
import Logs from "./Logs";
import Admins from "./Admins";
import Header from "./SuperAdminHeader";

export default function UnAuth() {
  return (
    <Header>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/clients" component={Clients} />
        <Route exact path="/sites" component={Sites} />
        <Route exact path="/logs" component={Logs} />
        <Route exact path="/admins" component={Admins} />
        <Redirect from="*" to="/" />
      </Switch>
    </Header>
  );
}
