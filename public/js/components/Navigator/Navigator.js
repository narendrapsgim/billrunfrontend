import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { userDoLogout } from '../../actions/userActions';
import classNames from "classnames";
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, ProgressBar} from "react-bootstrap";

class Navigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uiOpenSetting: true
    };
  }

  clickLogout = (e) => {
    e.preventDefault()
    this.props.userDoLogout();
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-static-top" role="navigation" style={{ marginBottom: 0 }}>
        <div className="navbar-header">
          <Link to="/" className="navbar-brand">
            <img src="/img/billrun-logo-tm.png" style={{ height: 22 }} />
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
                  <i className="fa fa-cubes fa-fw"></i> Plans
                </Link>
              </li>
              <li>
                <Link to="/products">
                  <i className="fa fa-book fa-fw"></i> Products
                </Link>
              </li>
              <li>
                <Link to="/customers"><i className="fa fa-user fa-fw"></i> Customers</Link>
              </li>
              <li>
                <Link to="/usage"><i className="fa fa-list fa-fw"></i> Usage</Link>
              </li>
              <li>
                <Link to="/invoices"><i className="fa fa-file-text-o fa-fw"></i> Invoices</Link>
              </li>
              <li>
                <Link to="/users"><i className="fa fa-user fa-fw"></i> User Managment</Link>
              </li>
              <li className={classNames({'active': !this.state.uiOpenSetting})}>
                <a href onClick={ (e)=> { e.preventDefault(); this.setState({ uiOpenSetting: !this.state.uiOpenSetting })}}><i className="fa fa-cog fa-fw"></i> Settings<span className="fa arrow"></span></a>
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
