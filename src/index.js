import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import Routes from './routes';
import DevTools from './components/DevTools';
import configureStore from './configureStore'
import * as serviceWorker from './serviceWorker';
/* Styles */
import 'react-bootstrap-multiselect/css/bootstrap-multiselect.css';
import 'react-tagsinput/react-tagsinput.css'
import "react-datepicker/dist/react-datepicker.css";
import 'font-awesome/css/font-awesome.min.css';
import './styles/css/normalize.css';
import './styles/css/sb-admin-2.css';
import './styles/css/yeti.css';
import './styles/scss/index.scss';
import './styles/css/index.css';

const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <Routes />
    {process.env.NODE_ENV === "development" && <DevTools />}
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
