import React from 'react';
import { Router, Route, DefaultRoute, RouteHandler, Redirect } from 'react-router';

import App       from '../containers/App';
import PlansList from '../components/PlansList';

export default () => {
  return (
    <Route path="/" component={App}>
      <Route name="plans" path="/plans" component={PlansList} />
    </Route>
  );
}
