import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import FlatButton from 'material-ui/lib/flat-button';
import activeComponent from 'react-router-active-component';

import SettingsInputComponent from 'material-ui/lib/svg-icons/action/settings-input-component';
import Dashboard from 'material-ui/lib/svg-icons/action/dashboard';
import Layers from 'material-ui/lib/svg-icons/maps/layers';
import Receipt from 'material-ui/lib/svg-icons/action/receipt';
import AccountCircle from 'material-ui/lib/svg-icons/action/account-circle';

import View from '../../view';

export default class Navigator extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let pages = [
      {label: "Dashboard", path: "/dashboard", icon: <Dashboard />},
      {label: "Plan Setup", path: "/plan-setup", icon: <SettingsInputComponent />},
      {label: "Plans & Items", path: '/plans-items', icon: <Layers />},
      {label: "Pay Management", path: '/pay-management', icon: <Receipt />},
      {label: "Subscribers", path: '/subscribers', icon: <AccountCircle />}
    ];

    let buttons = pages.map((page, key) => {
      return (
        <FlatButton key={key}
                    label={page.label}
                    linkButton={true}
                    labelStyle={{textTransform: "none"}}
                    style={{"padding": "10px"}}
                    icon={page.icon}
                    containerElement={<Link to={page.path} activeClassName="active">Dashboard</Link>} />

      );
    });

    return (
      <div className="navigator">
        {buttons}
      </div>
    );
  }
}
