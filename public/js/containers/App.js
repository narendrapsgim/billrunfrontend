import React, { Component } from 'react';
import Navigator from '../components/Navigator';
import Topbar from '../components/Topbar';
import { routes } from '../routes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Divider from 'material-ui/Divider';
import View from '../view';
import BraasTheme from '../theme';

export default class App extends Component {
  constructor(props) {
    super(props);
    injectTapEventPlugin();
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(BraasTheme)}>
        <div className="App">
          <Topbar />
          <div className="component container">
            <Navigator />
            <Divider />
            <div className="contents">
              {this.props.children}
            </div>
          </div>
          <footer className="footer">
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
