import React, { Component } from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import BraasTheme from '../theme';

import Navigator from '../components/Navigator';


export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({Height: "100%"});
  }
  
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(BraasTheme)}>      
        <div>
          <Navigator />
          <div id="page-wrapper" className="page-wrapper" ref="pageWrapper" style={{minHeight: this.state.Height}}>
            { this.props.children }
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
