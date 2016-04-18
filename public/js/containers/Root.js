import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import configureStore from '../configureStore.js';
import routes from '../routes.js';

let initialState = {};
const store = configureStore(initialState);

export default class Root extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <Router history={hashHistory}>
          {routes()}
        </Router>
      </Provider>
    );
  }
}
