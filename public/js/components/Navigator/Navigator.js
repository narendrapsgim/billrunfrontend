import React, { Component } from 'react';
import { Link } from 'react-router';
import classNames from "classnames";
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, ProgressBar} from "react-bootstrap";

export default class Navigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uiOpenSetting: false
    };
  }

  toggleMenu(){
    if($(".navbar-collapse").hasClass('collapse')){
      $(".navbar-collapse").removeClass('collapse');  
    }
    else{
      $(".navbar-collapse").addClass('collapse');
    }
  }
  
  render() {
    return (
      <nav className="navbar navbar-default navbar-static-top" role="navigation" style={{"marginBottom": "0px"}}>
        <div className="navbar-header">
          <button type="button" className="navbar-toggle" onClick={this.toggleMenu} style={{position: 'absolute', right: 0, top: 0}}>
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="index.html">Billrun</a>
        </div>

        <ul className="nav navbar-top-links navbar-right">
          <NavDropdown  title={<i className="fa fa-user fa-fw"></i>} >
            <MenuItem eventKey="1">
              <i className="fa fa-user fa-fw"></i> User Profile
            </MenuItem> 
            <MenuItem eventKey="2">
              <i className="fa fa-gear fa-fw"></i> Settings
            </MenuItem> 
            <MenuItem eventKey="3">
              <a href="http://www.strapui.com/" onClick={ () => { window.location='http://www.strapui.com/'; } }>
                <i className="fa fa-eye fa-fw"></i> Premium React Themes
              </a>
            </MenuItem> 
            <MenuItem divider />
            <MenuItem eventKey="4">
              <Link to="login">
                <i className="fa fa-sign-out fa-fw"></i> Logout
              </Link>
            </MenuItem>
        </NavDropdown>
        </ul>

        <div className="navbar-default sidebar" role="navigation">
          <div className="sidebar-nav navbar-collapse">

            <ul className="nav in" id="side-menu">
              <li>
                <Link to="/plans">
                  <i className="fa fa-dashboard fa-fw"></i>Plans
                </Link>
              </li>
              <li>
                <a href="#"><i className="fa fa-bar-chart-o fa-fw"></i> Products</a>
                <ul className="nav nav-second-level">
                </ul>
              </li>
              <li>
                <a href="customers.html"><i className="fa fa-table fa-fw"></i> Customers</a>
              </li>
              <li>
                <a href="usage.html"><i className="fa fa-edit fa-fw"></i> Usage</a>
              </li>
              <li>
                <a href="#"><i className="fa fa-wrench fa-fw"></i> Invoices</a>
              </li>
              <li>
                <a href="#"><i className="fa fa-sitemap fa-fw"></i> Log</a>
                
              </li>
              <li className={classNames({'active': !this.state.uiOpenSetting})}>
                <a href="javascript:void(0)" onClick={ ()=> this.setState({ uiOpenSetting: !this.state.uiOpenSetting })}><i className="fa fa-files-o fa-fw"></i> Setting<span className="fa arrow"></span></a>
                <ul className={classNames({'nav nav-second-level': true, 'collapse': this.state.uiOpenSetting})}>
                  <li>
                    <a href="blank.html">Date, Time and Zone</a>
                  </li>
                  <li>
                    <a href="login.html">Currency and Tax</a>
                  </li>
                  <li>
                    <a href="login.html">Input Processor</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
