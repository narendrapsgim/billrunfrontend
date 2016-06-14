import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, IndexRedirect } from 'react-router';
import App from './containers/App';
import PageBuilder from './components/PageBuilder';

import PlanSetup from './components/PlanSetup';
import PlansList from './components/PlansList';
import ProductsList from './components/ProductsList';
import ProductSetup from './components/ProductSetup';

export default () => {
  return (
    <Route path="/" component={App}>
      <IndexRedirect to="/dashboard" component={PageBuilder} />
      <Route path="/plan_setup(/:plan_id)" component={PlanSetup} />
      <Route path="/plans" component={PlansList} />
      <Route path="/products" component={ProductsList} />
      <Route path="/product_setup(/:product_id)" component={ProductSetup} />
      <Route path="/:page/:collection/:action(/:entity_id)" component={PageBuilder} />
      <Route path="/:page" component={PageBuilder} />
    </Route>
  );
}
