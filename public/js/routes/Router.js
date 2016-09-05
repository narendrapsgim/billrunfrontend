import React from 'react';
import { Router, Route, DefaultRoute, RouteHandler, Redirect } from 'react-router';

import App       from '../containers/App';
import CustomersList from '../components/CustomersList';
import CustomerSetup from '../components/CustomerSetup';
import PlansList from '../components/PlansList';
import InputProcessor from '../components/InputProcessor';
import InputProcessorsList from '../components/InputProcessorsList';
import Settings from '../components/Settings';

export default () => {
  return (
    <Route path="/" component={App}>
      <Route name="plans" path="/plans" component={PlansList} />
      <Route name="customers" path="/customers" component={CustomersList} />
      <Route name="customer" path="/customer" component={CustomerSetup} />
      <Route name="input_processor" path="/input_processor" component={InputProcessor} />
      <Route name="input_processors" path="/input_processors" component={InputProcessorsList} />
      <Route name="settings" path="/settings" component={Settings} />
    </Route>
  );
}
