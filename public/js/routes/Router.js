import React from 'react';
import { Router, Route, DefaultRoute, RouteHandler, Redirect, IndexRedirect } from 'react-router';

import RequireAuth from '../containers/Authentication';


import App from '../containers/App';
import PlansList from '../components/PlansList';
import Dashboard from '../components/Dashboard';
import PageNotFound from '../components/PageNotFound';
import LoginPage from '../components/LoginPage';

export default () => {
  return (
    <Route path="/" component={App}>
      <IndexRedirect to="dashboard" component={RequireAuth(Dashboard)} />
      <Route name="dashboard" path="dashboard" component={RequireAuth(Dashboard)} title="Dashbord"/>
      <Route name="plans" path="plans" component={RequireAuth(PlansList)} title="Plans"/>
      <Route name="login" path="login" component={LoginPage} title="Login"/>
      <Route path="*" component={PageNotFound} title="404 Page not found"/>
    </Route>
  );
}
