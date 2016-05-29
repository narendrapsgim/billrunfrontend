import React, { Component } from 'react';
import { connect } from 'react-redux';
import Avatar from 'material-ui/Avatar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import {indigo50,grey900, blue500} from 'material-ui/styles/colors';
import * as actions from '../../actions'

import axios from 'axios';

let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});

class Topbar extends Component {
  constructor(props) {
    super(props);

    this.clickLogin = this.clickLogin.bind(this);
    this.clickLogout = this.clickLogout.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.renderLoginForm = this.renderLoginForm.bind(this);
    this.renderErrorMessage = this.renderErrorMessage.bind(this);

    this.state = {
      showLoginForm : false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.auth){
      this.setState({
        showLoginForm: false,
      });
    }
  }
  
  clickLogin(){
    let username = this.refs.username.input.value;
    let password = this.refs.password.input.value;
    this.props.userDoLogin({username, password});
  }

  clickLogout(){
    this.props.userDoLogout();
  }

  handleOpen(){
    this.setState({showLoginForm: true});
  }

  handleClose() {
    this.setState({showLoginForm: false});
  }

  renderLoginButton(){
    return (
      <ToolbarGroup>
        <ToolbarTitle style={{color:indigo50, paddingRight: 0, lineHeight: '57px'}} text="Login" onClick={this.handleOpen} />
      </ToolbarGroup>
    )
  }

  renderErrorMessage(){
    if(!_.isEmpty(this.props.errorMessage)){
      return (
        <p style={{color:'red'}}>{this.props.errorMessage}</p>
      );
    } else {
      return null;
    }
  }

  renderLoginForm(){
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
        />,
      <FlatButton
        label="Login"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.clickLogin}
        />,
    ];
    return(
      <Dialog
        title="Login"
        actions={actions}
        modal={false}
        open={this.state.showLoginForm}
        onRequestClose={this.handleClose}
      >
        <div style={{margin: '0 25px 25px 25px'}}>
          {this.renderErrorMessage()}
          <TextField hintText="Enter user name or mail" floatingLabelText="User name" ref="username" />
          <br />
          <TextField hintText="Password" floatingLabelText="Password" type="password" ref="password" />
        </div>
        <Divider />
      </Dialog>
    );
  }

  rendeUserMenu(){
    return (
      <ToolbarGroup>
        <ToolbarSeparator style={{top: '13px'}}/>
        <Avatar
          color={blue500}
          backgroundColor={indigo50}
          size={40}
          style={{margin:'8px 10px 0 20px'}}
        >
        {this.props.userName[0]}
      </Avatar>
      <ToolbarTitle style={{color:indigo50, paddingRight: 0, lineHeight: '57px'}} text={this.props.userName} />
        <IconMenu style={{marginTop:'5px'}}
          iconButtonElement={
            <IconButton touch={true}>
              <NavigationExpandMoreIcon color={indigo50} />
            </IconButton>
          }
        >
          <MenuItem primaryText="Profile" />
          <MenuItem primaryText="Settings" />
          <MenuItem primaryText="Logout" onClick={this.clickLogout} />
        </IconMenu>
      </ToolbarGroup>
    );
  }

  render() {
    return (
      <div>
      <Toolbar className="topbar" style={{height: 70,backgroundColor : grey900}}>
        <ToolbarGroup>
          <a href="#">
            {<img src="img/billrun-logo-tm.png" />}
          </a>
        </ToolbarGroup>
          { !this.props.auth ? this.renderLoginButton() : this.rendeUserMenu() }
      </Toolbar>
      {this.renderLoginForm()}
    </div>
    );
  }
}

Topbar.defaultProps = {
  userName:'Anonymous'
};

function mapStateToProps(state) {
  return {
    auth: state.users.auth,
    userName : state.users.name,
    errorMessage : state.users.errorMessage,
    hack : state.users.hack
  };
}

export default connect(mapStateToProps, actions)(Topbar);
