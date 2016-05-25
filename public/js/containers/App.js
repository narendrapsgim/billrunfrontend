import React, { Component } from 'react';
import { connect } from 'react-redux';
import Navigator from '../components/Navigator';
import Topbar from '../components/Topbar';
import { routes } from '../routes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Divider from 'material-ui/Divider';
import View from '../view';
import BraasTheme from '../theme';
import LoginPage from '../components/HtmlPages/login';
import axios from 'axios';

export default class App extends Component {
  constructor(props) {
    super(props);
    injectTapEventPlugin();
  }

  renderAppContent(){
    if(this.props.auth){
      return (
        <div className="component container main-content">
          <Navigator />
          <Divider />
          <div className="contents">
            {this.props.children}
          </div>
        </div>
      );
    } else {
      return (
        <div className="component container main-content">
          <div className="contents">
            <LoginPage />
          </div>
        </div>
        );
    }
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(BraasTheme)}>
        <div className="App">
          <Topbar />
          {this.renderAppContent()}
          <footer className="footer navbar-fixed-bottom">
            <div className="container">
              <p>
                (c) 2016 Billrun All Right Reserved
              </p>
            </div>
          </footer>
        </div>
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.users.auth
  };
}

export default connect(mapStateToProps)(App);
