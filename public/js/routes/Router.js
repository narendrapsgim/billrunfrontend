import React from 'react';
import { Router, Route, DefaultRoute, RouteHandler, Redirect } from 'react-router';

import RequireAuth from '../containers/Authentication';
import App       from '../containers/App';
import CustomersList from '../components/CustomersList';
import ProductsList from '../components/ProductsList';
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
      <Route name="plans" path="/plans" component={PlansList} title="Plans" />
      <Route name="dashboard" path="dashboard" component={RequireAuth(Dashboard)} title="Dashbord"/>
      <Route name="customers" path="/customers" component={CustomersList} title="Customers" />
      <Route name="customer" path="/customer" component={CustomerSetup} title="Customer" />
      <Route name="input_processor" path="/input_processor" component={InputProcessor} title="Input Processor" />
      <Route name="input_processors" path="/input_processors" component={InputProcessorsList} title="Input Processors" />
      <Route name="settings" path="/settings" component={Settings} title="Settings" />
      <Route name="login" path="login" component={LoginPage} title="Login"/>
      <Route path="*" component={PageNotFound} title="404 Page not found"/>
    </Route>
  );
}
