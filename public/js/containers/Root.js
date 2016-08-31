import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import configureStore from '../configureStore';
import routesModule from '../routes/Router';
import Immutable from 'immutable';

const routes = routesModule();
const store = configureStore();

export default class Root extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          {routes}
        </Router>
      </Provider>
    );
  }
}
