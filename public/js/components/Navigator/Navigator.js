import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import {userDoLogout} from '../../actions/userActions';
import classNames from "classnames";
import { NavDropdown, MenuItem } from "react-bootstrap";
/* Assets */
import LogoImg from 'img/billrun-logo-tm.png';

class Navigator extends Component {
  constructor(props) {
    super(props);
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    this.state = {
      uiOpenSetting: true,
      showCollapseButton: false,
      showFullMenu: true,
      activeNav: ''
    };
  }

  componentWillMount() {
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize() {
    const small = window.innerWidth < 768;
    this.setState({showCollapseButton: small, showFullMenu: !small});
  }

  onToggleMenu() {
    const {showFullMenu} = this.state;
    this.setState({showFullMenu: !showFullMenu});
  }

  clickLogout = (e) => {
    e.preventDefault()
    this.props.userDoLogout();
  }

  setActivNav = (e) => {
    const {id} = e.target;
    this.setState({activeNav: id})
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top" role="navigation" style={{marginBottom: 0}}>
        <div className="navbar-header">
          <Link to="/" className="navbar-brand">
            <img src={LogoImg} style={{height: 22}}/>
          </Link>
        </div>

        <ul className="nav navbar-top-links navbar-right">
          <NavDropdown id="nav-user-menu" title={<i className="fa fa-user fa-fw"></i>}>
            <MenuItem eventKey="4" onClick={this.clickLogout}>
              <i className="fa fa-sign-out fa-fw"></i> Logout
            </MenuItem>
          </NavDropdown>
        </ul>
        {(() => {
          if (!this.state.showFullMenu) return (null);
          return (
            <div className="navbar-default sidebar" role="navigation">
              <div className="sidebar-nav navbar-collapse">

                <ul className="nav in" id="side-menu">
                  <li>
                    <Link to="/dashboard" id="dashboard"
                          className={(this.state.activeNav === "dashboard") ? "active" : ""} onClick={this.setActivNav}>
                      <i className="fa fa-dashboard fa-fw"></i> Dashboard
                    </Link>
                  </li>

                  <li>
                    <Link to="/plans" id="plans" className={(this.state.activeNav === "plans") ? "active" : ""}
                          onClick={this.setActivNav}>
                      <i className="fa fa-cubes fa-fw"></i> Plans
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" id="products" className={(this.state.activeNav === "products") ? "active" : ""}
                          onClick={this.setActivNav}>
                      <i className="fa fa-book fa-fw"></i> Products
                    </Link>
                  </li>
                  <li>
                    <Link to="/customers" id="customers"
                          className={(this.state.activeNav === "customers") ? "active" : ""} onClick={this.setActivNav}><i
                      className="fa fa-users fa-fw"></i> Customers</Link>
                  </li>
                  <li>
                    <Link to="/usage" id="usage" className={(this.state.activeNav === "usage") ? "active" : ""}
                          onClick={this.setActivNav}>
                      <i className="fa fa-list fa-fw"></i> Usage
                    </Link>
                  </li>
                  <li>
                    <Link to="/invoices" id="invoices" className={(this.state.activeNav === "invoices") ? "active" : ""}
                          onClick={this.setActivNav}>
                      <i className="fa fa-file-text-o fa-fw"></i> Invoices
                    </Link>
                  </li>
                  <li>
                    <Link to="/users" id="users" className={(this.state.activeNav === "users") ? "active" : ""}
                          onClick={this.setActivNav}>
                      <i className="fa fa-user fa-fw"></i> User Managment
                    </Link>
                  </li>
                  <li className={classNames({'active': !this.state.uiOpenSetting})}>
                    <a href className={classNames({'active': !this.state.uiOpenSetting})} onClick={ (e)=> {
                      e.preventDefault();
                      this.setState({uiOpenSetting: !this.state.uiOpenSetting})
                    }}><i className="fa fa-cog fa-fw"></i> Settings<span className="fa arrow"></span></a>
                    <ul className={classNames({'nav nav-second-level': true, 'collapse': this.state.uiOpenSetting})}>
                      <li>

                        <Link to="/settings?setting=billrun" id="settingsBillrun"
                              className={(this.state.activeNav === "settingsBillrun") ? "active" : ""}
                              onClick={this.setActivNav}>Date, Time and Zone</Link>
                      </li>
                      <li>
                        <Link to="/settings?setting=pricing" id="settingsPricing"
                              className={(this.state.activeNav === "settingsPricing") ? "active" : ""}
                              onClick={this.setActivNav}>Currency and Tax</Link>
                      </li>
                      <li>
                        <Link to="/input_processors" id="settingsProcessor"
                              className={(this.state.activeNav === "settingsProcessor") ? "active" : ""}
                              onClick={this.setActivNav}>Input Processors</Link>
                      </li>
                      <li>
                        <Link to="/export_generators" id="settingsGenerator"
                              className={(this.state.activeNav === "settingsGenerator") ? "active" : ""}
                              onClick={this.setActivNav}>Export Generator</Link>
                      </li>
                      <li>
                        <Link to="/payment_gateways" id="settingsGateway"
                              className={(this.state.activeNav === "settingsGateway") ? "active" : ""}
                              onClick={this.setActivNav}>Payment Gateways</Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          );
        })()}
      </nav>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    userDoLogout
  }, dispatch);
}
export default connect(null, mapDispatchToProps)(Navigator);
