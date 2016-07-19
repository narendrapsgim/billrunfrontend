import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';


export default class PlaceHolder extends Component {

  getStyles() {
    return  { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'};
  }

  render() {
    return (
      <div style={this.getStyles()}>
        <CircularProgress size={2} />
      </div>
    );
  }
}
