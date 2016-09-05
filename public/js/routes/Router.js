import React from 'react';
import { Router, Route, DefaultRoute, RouteHandler, Redirect } from 'react-router';

import App       from '../containers/App';
import CustomersList from '../components/CustomersList';
import CustomerSetup from '../components/CustomerSetup';
import PlansList from '../components/PlansList';
import InputProcessor from '../components/InputProcessor';
import InputProcessorsList from '../components/InputProcessorsList';
import Settings from '../components/Settings';
import Dashboard from '../components/Dashboard';
import PageNotFound from '../components/PageNotFound';
import LoginPage from '../components/LoginPage';

export default () => {
  return (
    <Route path="/" component={App}>
      <Route name="plans" path="/plans" component={PlansList} />
      <Route name="dashboard" path="dashboard" component={RequireAuth(Dashboard)} title="Dashbord"/>
      <Route name="customers" path="/customers" component={CustomersList} />
      <Route name="customer" path="/customer" component={CustomerSetup} />
      <Route name="input_processor" path="/input_processor" component={InputProcessor} />
      <Route name="input_processors" path="/input_processors" component={InputProcessorsList} />
      <Route name="settings" path="/settings" component={Settings} />
      <Route name="login" path="login" component={LoginPage} title="Login"/>
      <Route path="*" component={PageNotFound} title="404 Page not found"/>
    </Route>
  );
}
