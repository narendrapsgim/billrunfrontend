import React, { Component } from 'react';

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
      <div>
        <Navigator />
        <div id="page-wrapper" className="page-wrapper" ref="pageWrapper" style={{minHeight: this.state.Height}}>
          { this.props.children }
        </div>
      </div>
    );
  }
}
