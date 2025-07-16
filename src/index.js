import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AdminLayout from "layouts/Admin.js";
import Login from "views/login";
import ProtectedRoute from "components/secuirity/ProtectedRoute";// ✅ Make sure this path matches your folder
import 'bootstrap/dist/css/bootstrap.min.css';
import MachineDetail from "views/MachineDetails";
import MachineList from "views/Icons";
import Account from "views/Account";
//localStorage.setItem("isAuthenticated", "false");

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      {/* Routes are matched in order, so more specific paths should come first */}
      <Route path="/login" component={Login} />
      <ProtectedRoute path="/admin" component={AdminLayout} />
      <ProtectedRoute path="/machines/:name" component={MachineDetail} />
      <ProtectedRoute path="/icons" exact component={MachineList} />
      <ProtectedRoute path="/account" component={Account} />

      {/* Redirect if no routes match */}
      <Redirect to="/login" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
