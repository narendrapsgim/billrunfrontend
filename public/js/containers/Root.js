import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import configureStore from '../configureStore';
import routesModule from '../routes/Router';
import Immutable from 'immutable';
import injectTapEventPlugin from 'react-tap-event-plugin';

const routes = routesModule();
const store = configureStore();

export default class Root extends Component {
  constructor(props) {
    super(props);
    injectTapEventPlugin();
  }

  render() {
    return (
      <Provider store={store}>
        <Router history={hashHistory}>
          {routes}
        </Router>
      </Provider>
    );
  }
}
