import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, IndexRedirect } from 'react-router';
import App from './containers/App';
import PageBuilder from './components/PageBuilder';

import RequireAuth from './containers/Authentication';

import PlanSetup from './components/PlanSetup';
import PlansList from './components/PlansList';
import ProductsList from './components/ProductsList';
import ProductSetup from './components/ProductSetup';
import Dashboard from './components/Dashboard';
import SubscribersList from './components/SubscribersList';
import SubscriberEdit from './components/Subscriber/SubscriberEdit';
import UsageList from './components/UsageList';
import Log from './components/Log';
import Settings from './components/Settings';
import Invoices from './components/Invoices';

export default () => {
  return (
    <Route path="/" component={App}>
      <IndexRedirect to="/dashboard" component={PageBuilder} />
      <Route name="dashboard" path="/dashboard" component={RequireAuth(Dashboard)} />
      <Route name="plan_setup" path="/plan_setup" component={RequireAuth(PlanSetup)} />
      <Route name="plans" path="/plans" component={RequireAuth(PlansList)} />
      <Route name="products" path="/products" component={RequireAuth(ProductsList)} />
      <Route name="product_setup" path="/product_setup" component={RequireAuth(ProductSetup)} />
      <Route name="subscribers" path="/subscribers" component={RequireAuth(SubscribersList)} />
      <Route name="subscriber" path="/subscriber" component={RequireAuth(SubscriberEdit)} />
      <Route name="usage" path="/usage" component={RequireAuth(UsageList)} />
      <Route name="log" path="/log" component={RequireAuth(Log)} />
      <Route name="settings" path="/settings" component={RequireAuth(Settings)} />
      <Route name="invoices" path="/invoices" component={RequireAuth(Invoices)} />
    </Route>
  );
}
