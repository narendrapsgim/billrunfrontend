import React, { Component } from 'react';
import { connect } from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Snackbar from 'material-ui/Snackbar';

import * as actions from '../../actions';
import _ from 'lodash';

const styles = {
  success : {backgroundColor:'green'},
  info: {backgroundColor:'blue'},
  warning: {backgroundColor:'yellow'},
  error: {backgroundColor:'red'}

}
class Loader extends Component {
  constructor(props) {
    super(props);
    this.renderLoader = this.renderLoader.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.renderMessage = this.renderMessage.bind(this);

    this.state = {
      loading: props.loading,
      message: null,
      messageType: 'info'
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loading: nextProps.loading,
      message: nextProps.message,
      messageType: nextProps.messageType
    });
  }

  renderLoader(){
    return(
      <LinearProgress mode="indeterminate"/>
    );
  }
  renderMessage(){
    return(
      <Snackbar
        open={!_.isEmpty(this.state.message)}
        message={this.state.message}
        autoHideDuration={4000}
        onRequestClose={this.handleRequestClose}
        bodyStyle={styles[this.state.messageType]}
      />
    );
  }

  handleRequestClose(){
    this.props.hideStatusMessage();
  };

  render() {
    return (
      <div>
        { this.state.loading ? this.renderLoader() : null}
        { !_.isEmpty(this.state.message) ? this.renderMessage() : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: (typeof state.statusBar.loading === 'undefined') ? false : state.statusBar.loading,
    message: (typeof state.statusBar.message === 'undefined') ? null : state.statusBar.message,
    messageType: (typeof state.statusBar.messageType === 'undefined') ? 'info' : state.statusBar.messageType, // success / info / warning / error
  };
}

export default connect(mapStateToProps, actions)(Loader);
