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

    this.state = {
      showLoginForm: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showLoginForm: nextProps.auth ? false : nextProps.displayPopup,
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
  };
}

export default connect(mapStateToProps, actions)(LoginPopup);
