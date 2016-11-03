import React, { Component } from 'react';
import { connect } from 'react-redux';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';

import * as actions from '../../actions'

class LoginPopup extends Component {
  constructor(props) {
    super(props);
    this.clickLogin = this.clickLogin.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      showLoginForm: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    // Hide popup after sucess login complete
    if(this.props.auth === false && nextProps.auth == true){
      this.setState({
        showLoginForm: false,
      });
    }
    // change popup display state if action require to change display state
    else if(typeof nextProps.displayPopup !== 'undefined' && nextProps.displayPopup !== this.state.showLoginForm){
      this.setState({
        showLoginForm: nextProps.displayPopup,
      });
    }
  }

  handleClose() {
    this.props.closeLoginPopup();
  }

  clickLogin(e){
    e.preventDefault();
    e.stopPropagation();
    let username = this.refs.username.input.value;
    let password = this.refs.password.input.value;
    this.props.userDoLogin({username, password});
  }

  getFormActions(){
    const actions = [
      <div><Divider style={{marginBottom:'10px'}}/></div>,
      <div>
        <RaisedButton
          label="Cancel"
          secondary={true}
          onTouchTap={this.handleClose}
        />
        <RaisedButton
          label="Login"
          style={{margin:'0 10px'}}
          primary={true}
          onTouchTap={this.clickLogin}
        />
      </div>
    ];
    return actions;
  }

  renderLoginForm(){
    return(
      <form style={{margin: '0 25px 25px 25px'}} onSubmit={this.clickLogin}>
        <TextField autoFocus hintText="Enter user" floatingLabelText="User name" ref="username" />
        <br />
        <TextField hintText="Password" floatingLabelText="Password" type="password" ref="password" />
        <input type="submit" style={{visibility: 'hidden'}}/>
      </form>
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
