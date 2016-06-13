import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, IndexRedirect } from 'react-router';
import App from './containers/App';
import PageBuilder from './components/PageBuilder';

import PlanSetup from './components/PlanSetup';
import PlansList from './components/PlansList';

export default () => {
  return (
    <Route path="/" component={App}>
      <IndexRedirect to="/dashboard" component={PageBuilder} />
      <Route path="/plan_setup(/:plan_id)" component={PlanSetup} />
      <Route path="/plans" component={PlansList} />
      <Route path="/:page/:collection/:action(/:entity_id)" component={PageBuilder} />
      <Route path="/:page" component={PageBuilder} />
    </Route>
  );
}
