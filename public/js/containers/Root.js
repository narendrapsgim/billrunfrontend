import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import configureStore from '../configureStore';
import routesModule from '../routes/Router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import DevTools from './DevTools';
/* Styles */
import 'react-bootstrap-multiselect/css/bootstrap-multiselect.css';
import 'react-select/dist/react-select.css';
import 'react-tagsinput/react-tagsinput.css'
import 'react-datepicker/dist/react-datepicker.css';
import 'font-awesome/css/font-awesome.css';
import 'css/normalize.css';
import 'css/sb-admin-2.css';
import 'css/yeti.css';
import 'css/style.css';

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
        <div>
          <Router history={hashHistory}>
            {routes}
          </Router>
          { !_PRODUCTION_ && <DevTools /> }
        </div>
      </Provider>
    );
  }
}
