import React from 'react';
import { Route, Link, IndexRedirect } from 'react-router';
import App from './containers/App';
import PageBuilder from './components/PageBuilder';

export default () => {
  return (
    <Route path="/" component={App}>
      <IndexRedirect to="/dashboard" />
      <Route path="dashboard" component={PageBuilder} page="dashboard" />
      <Route path="plan-setup" component={PageBuilder} page="plan_setup" />
    </Route>
  );
}
