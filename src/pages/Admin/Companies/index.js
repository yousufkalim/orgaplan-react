import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Companies from "./Companies";
import AddCompanies from "./AddCompanies";
import EditCompanies from "./EditCompanies";
import CompaniesCalender from "./CompaniesCalender";
import UserList from "./UserList";
import AddUser from "./AddUser";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/"} component={Companies} />
      <Route
        exact
        path={props.match.path + "/add-companies"}
        component={AddCompanies}
      />
      <Route
        exact
        path={props.match.path + "/edit-companies"}
        component={EditCompanies}
      />
      <Route
        exact
        path={props.match.path + "/calendar"}
        component={CompaniesCalender}
      />
      <Route
        exact
        path={props.match.path + "/user-list/:id"}
        component={UserList}
      />
      <Route exact path={props.match.path + "/add-user"} component={AddUser} />

      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}
