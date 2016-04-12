import React, { Component } from 'react';
import Navigator from '../components/Navigator';
import Topbar from '../components/Topbar';
import { routes } from '../routes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Fields from '../fields';

export default class App extends Component {
  constructor(props) {
    super(props);
    injectTapEventPlugin();
  }

  render() {
    return (
      <div className="App">
        <Topbar />
        <div className="component container">
          <Navigator />
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
    );
  }
}
