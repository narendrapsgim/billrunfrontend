import React, { Component } from 'react';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';

import * as actions from '../../actions'

export default class LoginPopup extends Component {
  constructor(props) {
    super(props);
    this.clickLogin = this.clickLogin.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.renderErrorMessage = this.renderErrorMessage.bind(this);

    this.state = {
      showLoginForm: false,
      errorMessage: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showLoginForm: nextProps.auth ? false : nextProps.displayPopup,
      errorMessage: nextProps.auth ? '': nextProps.errorMessage,
    });
  }

  handleClose() {
    this.props.closeLoginPopup();
  }

  clickLogin(){
    let username = this.refs.username.input.value;
    let password = this.refs.password.input.value;
    this.props.userDoLogin({username, password});
  }

  renderErrorMessage(){
    if(!_.isEmpty(this.state.errorMessage)){
      return (
        <p style={{color:'red'}}>{this.state.errorMessage}</p>
      );
    } else {
      return <p></p>;
    }
  }

  getFormActions(){
    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Login"
        primary={true}
        onTouchTap={this.clickLogin}
      />,
    ];
    return actions;
  }

  renderLoginForm(){
    return(
      <div style={{margin: '0 25px 25px 25px'}}>
        {this.renderErrorMessage()}
        <TextField hintText="Enter user name or mail" floatingLabelText="User name" ref="username" />
        <br />
        <TextField hintText="Password" floatingLabelText="Password" type="password" ref="password" />
      </div>
    );
  }

  render() {
    return (
      <Dialog
        title="Login"
        actions={this.getFormActions()}
        modal={true}
        open={this.state.showLoginForm}
        onRequestClose={this.handleClose}
      >
        {this.renderLoginForm()}
        <Divider />
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.users.auth,
    displayPopup: state.login.displayPopup,
    errorMessage: state.login.errorMessage,
  };
}

LoginPopup.defaultProps = {
  login: {
    displayPopup: true,
    errorMessage: ""
  }
};

export default connect(mapStateToProps, actions)(LoginPopup);
