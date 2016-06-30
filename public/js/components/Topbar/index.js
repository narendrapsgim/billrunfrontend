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
import {Link} from 'react-router'

import {indigo50,grey900, blue500} from 'material-ui/styles/colors';
import * as actions from '../../actions'
import View from '../../views';

class Topbar extends Component {
  constructor(props) {
    super(props);
    this.clickLogout = this.clickLogout.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.renderLoginButton = this.renderLoginButton.bind(this);
  }

  clickLogout(){
    this.props.userDoLogout();
  }

  handleOpen(){
    this.props.openLoginPopup();
  }

  renderLoginButton(){
    return (
      <ToolbarGroup>
        <ToolbarTitle style={{color:indigo50, paddingRight: 0, lineHeight: '57px'}} text="Login" onClick={this.handleOpen} />
      </ToolbarGroup>
    )
  }

  isMenuItemVisible(neededPermissions) {
    return  _.intersection(neededPermissions, this.props.userRoles).length > 0;
  }

  renderUserMenuItems(){
    let buttons = Object.keys(View.pages).map((page, key) => {
        if((typeof View.pages[page].menu_type !== 'undefined' && View.pages[page].menu_type === 'user') && this.isMenuItemVisible( View.pages[page].permission)){
          let route = View.pages[page].route ? View.pages[page].route : page;
          let label = View.pages[page].menu_title || View.pages[page].title;
          return (
            <Link key={key} to={route} activeClassName='active' style={{textDecoration: 'none'}}>
              <MenuItem primaryText={label} />
            </Link>
          )
        } else {
          return null;
        }
      });
      return buttons;
  }

  renderUserMenu(){
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
          {this.renderUserMenuItems()}
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
          { !this.props.auth ? this.renderLoginButton() : this.renderUserMenu() }
      </Toolbar>
    </div>
    );
  }
}

Topbar.defaultProps = {
  userName:'Anonymous'
};

function mapStateToProps(state) {
  return {
    userRoles: state.users.roles,
    auth: state.users.auth,
    userName : state.users.name,
  };
}

export default connect(mapStateToProps, actions)(Topbar);
