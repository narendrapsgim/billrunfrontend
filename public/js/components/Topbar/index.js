import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {indigo50,grey900} from 'material-ui/styles/colors';


export default class Topbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Toolbar className="topbar" style={{height: 70,backgroundColor : grey900}}>
        <ToolbarGroup>
          <a href="#">
            {<img src="img/billrun-logo-tm.png" />}
          </a>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarSeparator style={{top: '13px'}}/>
          <Avatar
            src="https://avatars.githubusercontent.com/u/1040582?v=3"
            size={40}
            style={{margin:'8px 10px 0 20px'}}
          />
        <ToolbarTitle style={{color:indigo50, paddingRight: 0, lineHeight: '57px'}} text="Ofer Cohen" />
          <IconMenu style={{marginTop:'5px'}}
            iconButtonElement={
              <IconButton touch={true}>
                <NavigationExpandMoreIcon color={indigo50} />
              </IconButton>
            }
          >
            <MenuItem primaryText="Profile" />
            <MenuItem primaryText="Settings" />
          </IconMenu>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
