import React from 'react';
import { Router, Route, DefaultRoute, RouteHandler, Redirect, IndexRedirect } from 'react-router';

import App       from '../containers/App';
import PlansList from '../components/PlansList';
import Dashboard from '../components/Dashboard';

export default () => {
  return (
    <Route path="/" component={App}>
      <IndexRedirect to="/dashboard" component={Dashboard} />
      <Route name="dashboard" path="/dashboard" component={Dashboard} title="Dashbord"/>
      <Route name="plans" path="/plans" component={PlansList} title="Plans"/>
    </Route>
  );
}
