import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import Navigator from '../components/Navigator';
import Topbar from '../components/Topbar';
import { routes } from '../routes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Divider from 'material-ui/Divider';
import BraasTheme from '../theme';
import axios from 'axios';
import * as actions from '../actions'
import LoginPopup from '../components/Authorization/LoginPopup';
import StatusBar from '../components/StatusBar/StatusBar';

export default class App extends Component {
  constructor(props) {
    super(props);
    injectTapEventPlugin();
  }

  componentWillMount() {
    this.props.userCheckLogin();
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(BraasTheme)}>
        <div className="App">
          <Topbar />
          <Navigator />
            <div className="container-fluid main-content">
              <StatusBar />
              <div className="contents">
                {this.props.children}
              </div>
            </div>
          <footer className="footer navbar-fixed-bottom">
            <div className="container-fluid">
              <p>
                (c) 2016 Billrun All Right Reserved
              </p>
            </div>
          </footer>
          <LoginPopup />
        </div>
      </MuiThemeProvider>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    users: state.users,
    pages: state.pages
  };
}

export default connect(mapStateToProps, actions)(App);
