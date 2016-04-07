import React, { Component } from 'react';
import { Router, hashHistory } from 'react-router';
import routes from '../routes.js';

export default class Root extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router history={hashHistory}>
        {routes()}
      </Router>
    );
  }
}
