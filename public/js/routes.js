import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, IndexRedirect } from 'react-router';
import App from './containers/App';
import PageBuilder from './components/PageBuilder';

import PlanSetup from './components/PlanSetup';
import PlansList from './components/PlansList';
import ProductsList from './components/ProductsList';
import ProductSetup from './components/ProductSetup';
import Dashboard from './components/Dashboard';
import SubscribersList from './components/SubscribersList';
import SubscriberEdit from './components/Subscriber/SubscriberEdit';
import UsageList from './components/UsageList';

export default () => {
  return (
    <Route path="/" component={App}>
      <IndexRedirect to="/dashboard" component={PageBuilder} />
      <Route name="dashboard" path="/dashboard" component={Dashboard} />
      <Route name="plan_setup" path="/plan_setup" component={PlanSetup} />
      <Route name="plans" path="/plans" component={PlansList} />
      <Route name="products" path="/products" component={ProductsList} />
      <Route name="product_setup" path="/product_setup(/:product_id)" component={ProductSetup} />
      <Route name="subscribers_list" path="/subscribers_list" component={SubscribersList} />
      <Route name="subscriber" path="/subscriber" component={SubscriberEdit} />
      <Route name="usage" path="/usage" component={UsageList} />
      <Route path="/:page/:collection/:action(/:entity_id)" component={PageBuilder} />
      <Route path="/:page" component={PageBuilder} />
    </Route>
  );
}
