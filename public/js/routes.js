import React from 'react';
import { Route, Link, IndexRedirect } from 'react-router';
import App from './containers/App';
import Dashboard from './components/Dashboard';
import PlanSetup from './components/PlanSetup';

export default () => {
  return (
    <Route path="/" component={App}>
      <IndexRedirect to="/dashboard" />
      <Route path="dashboard" component={Dashboard} />
      <Route path="plan-setup" component={PlanSetup} />
    </Route>
  );
}
