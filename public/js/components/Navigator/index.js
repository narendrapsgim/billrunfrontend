import React, { Component } from 'react';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import FlatButton from 'material-ui/FlatButton';
import activeComponent from 'react-router-active-component';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import SettingsInputComponent from 'material-ui/svg-icons/action/settings-input-component';
import Dashboard from 'material-ui/svg-icons/action/dashboard';
import Layers from 'material-ui/svg-icons/maps/layers';
import Receipt from 'material-ui/svg-icons/action/receipt';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import View from '../../views';

const routes = [
  {to: "/dashboard", label: "Dashboard"},
  {to: "/plans", label: "Plans"},  
  {to: "/products", label: "Products"},
  {to: "/subscribers_list", label: "Subscribers"},
  {to: "/usage", label: "Usage"},
  {to: "/invoices", label: "Invoices"},
  {to: "/log", label: "Log"},
  {to: "/settings", label: "Settings"}
];

export default class Navigator extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let buttons = routes.map((route, key) => (
      <Link to={route.to} key={key} activeClassName='active'>
        <FlatButton label={route.label} labelStyle={{textTransform: "none"}} style={{minWidth: "180px", maxWidth: "240px"}} />
      </Link>
    ));

    return (
      <div className="navigator">
        {buttons}
      </div>
    );
  }
};
