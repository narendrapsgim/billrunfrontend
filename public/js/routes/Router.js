import React from 'react';
import { Router, Route, DefaultRoute, RouteHandler, Redirect } from 'react-router';

import App       from '../containers/App';
import PlansList from '../components/PlansList';
import InputProcessor from '../components/InputProcessor';
import InputProcessorsList from '../components/InputProcessorsList';
import Settings from '../components/Settings';

export default () => {
  return (
    <Route path="/" component={App}>
      <Route name="plans" path="/plans" component={PlansList} />
      <Route name="input_processor" path="/input_processor" component={InputProcessor} />
      <Route name="input_processors" path="/input_processors" component={InputProcessorsList} />
      <Route name="settings" path="/settings" component={Settings} />
    </Route>
  );
}
