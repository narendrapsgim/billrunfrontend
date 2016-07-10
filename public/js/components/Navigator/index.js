import React, { Component } from 'react';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import FlatButton from 'material-ui/FlatButton';
import activeComponent from 'react-router-active-component';

import MenuItem from 'react-bootstrap/lib/MenuItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavItem from 'react-bootstrap/lib/NavItem';
import Nav from 'react-bootstrap/lib/Nav';

import SettingsInputComponent from 'material-ui/svg-icons/action/settings-input-component';
import Dashboard from 'material-ui/svg-icons/action/dashboard';
import Layers from 'material-ui/svg-icons/maps/layers';
import Receipt from 'material-ui/svg-icons/action/receipt';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import View from '../../views';

const routes = [
  {to: "#/dashboard", label: "Dashboard"},
  {label: "Plan", routes: [
    {to: "#/plans", label: "Plans"},
    {to: "#/plan_setup", label: "Plan Setup"}
  ]},
  {label: "Product", routes: [
    {to: "#/products", label: "Products"},
    {to: "#/product_setup", label: "Product Setup"}
  ]},
  {label: "Subscriber", routes: [
    {to: "#/subscribers_list", label: "Subscribers"},
    {to: "#/usage", label: "Usage"},
  ]},
  {to: "#/invoices", label: "Invoices"},
  {to: "#/log", label: "Log"},
  {to: "#/settings", label: "Settings"}
];

export default class Navigator extends Component {
  constructor(props) {
    super(props);

    this.handleDropDownMenu = this.handleDropDownMenu.bind(this);
    this.createMenuItem = this.createMenuItem.bind(this);

    this.state = {
      ddMenuItem: ""
    };
  }

  handleDropDownMenu(e, i, v) {
    this.setState({ddMenuItem: v});
  }
  
  isMenuItemVisible(neddedPpermission) {
    return  _.intersection(neddedPpermission, this.props.users.roles).length > 0;
  }

  createMenuItem(routes, k) {
    const eventKey = (pk, ek) => {
      if (pk) return `${pk}.${ek}`;
      return ek;
    };

    return routes.map((route, key) => {
      if (route.routes) {
        return (
          <NavDropdown title={route.label} id={`navbar-${route.label}`} key={key} eventKey={key + 1}>
            { this.createMenuItem(route.routes, key) }
          </NavDropdown>
        );
      }
      return (
        <MenuItem key={key} href={route.to} eventKey={eventKey(k, key + 1)}>
          {route.label}
        </MenuItem>
      );
    });
  }

  render() {
    const items = this.createMenuItem(routes);
    return (
      <div className="navigator">
        <Navbar inverse>
          <Nav>
            {items}
          </Nav>
        </Navbar>
      </div>
    );
  }
};
