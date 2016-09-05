import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import classNames from "classnames";
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, ProgressBar} from "react-bootstrap";

import { userDoLogout } from '../../actions/userActions';


class Navigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uiOpenSetting: false
    };
  }

  clickLogout = (e) => {
    e.preventDefault()
    this.props.userDoLogout();
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-static-top" role="navigation" style={{"marginBottom": "0px"}}>
        <div className="navbar-header">
          <Link to="/" className="navbar-brand">
            BillRun!
          </Link>
        </div>

        <ul className="nav navbar-top-links navbar-right">
          <NavDropdown  title={<i className="fa fa-user fa-fw"></i>} >
          {/*
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
          */}
            <MenuItem eventKey="4">
              <Link to="#" onClick={this.clickLogout}>
                <i className="fa fa-sign-out fa-fw"></i> Logout
              </Link>
            </MenuItem>
        </NavDropdown>
        </ul>

        <div className="navbar-default sidebar" role="navigation">
          <div className="sidebar-nav navbar-collapse">

            <ul className="nav in" id="side-menu">
              <li>
                <Link to="/dashboard">
                  <i className="fa fa-dashboard fa-fw"></i> Dashboard
                </Link>
              </li>

              <li>
                <Link to="/plans">
                  <i className="fa fa-table fa-fw"></i> Plans
                </Link>
              </li>
              <li>
                <Link to="/products">
                  <i className="fa fa-table fa-fw"></i> Products
                </Link>
              </li>
              <li>
                <Link to="/customers"><i className="fa fa-table fa-fw"></i> Customers</Link>
              </li>
              {/* <li>
                  <Link to="usage.html"><i className="fa fa-edit fa-fw"></i> Usage</Link>
                  </li> */}
              {/* <li>
                  <Link to="#"><i className="fa fa-wrench fa-fw"></i> Invoices</Link>
                  </li> */}
              {/* <li>
                  <Link to="#"><i className="fa fa-sitemap fa-fw"></i> Log</Link>
                  </li> */}
              <li className={classNames({'active': !this.state.uiOpenSetting})}>
                <Link to="javascript:void(0)" onClick={ ()=> this.setState({ uiOpenSetting: !this.state.uiOpenSetting })}>
                  <i className="fa fa-gears fa-fw"></i> Setting<span className="fa arrow"></span>
                </Link>
                <ul className={classNames({'nav nav-second-level': true, 'collapse': this.state.uiOpenSetting})}>
                  <li>
                    <Link to="/settings?setting=billrun">Date, Time and Zone</Link>
                  </li>
                  <li>
                    <Link to="/settings?setting=pricing">Currency and Tax</Link>
                  </li>
                  <li>
                    <Link to="/input_processors">Input Processors</Link>
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    userDoLogout }, dispatch);
}
export default connect(null, mapDispatchToProps)(Navigator);
