import React from 'react';
import { Route, Link, IndexRedirect } from 'react-router';
import App from './containers/App';
import PageBuilder from './components/PageBuilder';

export default () => {
  return (
    <Route path="/" component={App}>
      <IndexRedirect to="/dashboard" />
      <Route path="/:page" component={PageBuilder}  />
    </Route>
  );
}
