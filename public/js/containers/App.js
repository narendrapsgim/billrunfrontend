import React, { Component } from 'react';
import Navigator from '../components/Navigator';
import Topbar from '../components/Topbar';
import { routes } from '../routes';
import injectTapEventPlugin from 'react-tap-event-plugin';

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
          <div className="contents container">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
