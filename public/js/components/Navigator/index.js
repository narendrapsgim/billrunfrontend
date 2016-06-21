import React, { Component } from 'react';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import FlatButton from 'material-ui/FlatButton';
import activeComponent from 'react-router-active-component';

import SettingsInputComponent from 'material-ui/svg-icons/action/settings-input-component';
import Dashboard from 'material-ui/svg-icons/action/dashboard';
import Layers from 'material-ui/svg-icons/maps/layers';
import Receipt from 'material-ui/svg-icons/action/receipt';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import View from '../../views';

let routes = [
  {to: "/dashboard", label: "Dashboard"},
  {to: "/plans", label: "Plans"},
  {to: "/plan_setup", label: "Plan Setup"},
  {to: "/products", label: "Products"},
  {to: "/subscribers_list", label: "Subscribers"}
];

export default class Navigator extends Component {
  constructor(props) {
    super(props);
  }

  isMenuItemVisible(neddedPpermission) {
    return  _.intersection(neddedPpermission, this.props.users.roles).length > 0;
  }

  render() {
    let buttons = routes.map((route, key) => (
      <Link to={route.to} key={key} activeClassName='active'>
        <FlatButton label={route.label} labelStyle={{textTransform: "none"}} style={{width: "240px"}} />
      </Link>
    ));

    return (
      <div className="navigator">
        {buttons}
      </div>
    );
  }
};
