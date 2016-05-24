import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {indigo50,grey900, blue500} from 'material-ui/styles/colors';

export default class Topbar extends Component {
  constructor(props) {
    super(props);

    this.clickLogin = this.clickLogin.bind(this);
    this.clickLogout = this.clickLogout.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.renderLoginForm = this.renderLoginForm.bind(this);
    this.setUserName = this.setUserName.bind(this);

    this.state = {
      showLogin: props.showLogin,
      showLoginForm : false,
      userName : props.userName,
    };
  }

  setUserName(e,value){
    this.setState({
      userName : value
    });
  }

  clickLogin(){
    this.setState({
      showLogin: false,
      showLoginForm:false
    });
  }

  clickLogout(){
    this.setState({
      showLogin: true
    });
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
    <div>
        <Dialog
          title="Login"
          actions={actions}
          modal={false}
          open={this.state.showLoginForm}
          onRequestClose={this.handleClose}
        >
          <TextField hintText="Enter user name or mail" floatingLabelText="User name" onChange={this.setUserName} />
          <br />
          <TextField hintText="Password" floatingLabelText="Password" type="password" />
        </Dialog>
      </div>
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
        {this.state.userName[0]}
      </Avatar>
      <ToolbarTitle style={{color:indigo50, paddingRight: 0, lineHeight: '57px'}} text={this.state.userName} />
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
          { this.state.showLogin ? this.renderLoginButton() : this.rendeUserMenu() }
      </Toolbar>
      {this.renderLoginForm()}
    </div>
    );
  }
}

Topbar.defaultProps = {
  showLogin: true,
  userName:'Anonymous'
};
