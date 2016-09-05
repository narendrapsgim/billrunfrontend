import React from 'react';
import { Router, Route, DefaultRoute, RouteHandler, Redirect, IndexRedirect } from 'react-router';

import RequireAuth from '../containers/Authentication';
import App from '../containers/App';
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
      <IndexRedirect to="/dashboard" component={RequireAuth(Dashboard)} />
      <Route path="/dashboard" component={RequireAuth(Dashboard)} title="Dashbord" name="dashboard" />
      <Route path="/plans" component={RequireAuth(PlansList)} title="Plans" name="plans" />
      <Route path="/customers" component={RequireAuth(CustomersList)} title="Customers" name="customers" />
      <Route path="/customer" component={RequireAuth(CustomerSetup)} title="Customer" name="customer" />
      <Route path="/input_processor" component={RequireAuth(InputProcessor)} title="Input Processor" name="input_processor" />
      <Route path="/input_processors" component={RequireAuth(InputProcessorsList)} title="Input Processors" name="input_processors" />
      <Route path="/settings" component={RequireAuth(Settings)} title="Settings" name="settings" />
      <Route path="/login" component={LoginPage} title="Login" name="login" />
      <Route path="*" component={PageNotFound} />
    </Route>
  );
}
