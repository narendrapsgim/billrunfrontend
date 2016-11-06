import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link, withRouter} from 'react-router';
import {userDoLogout} from '../../actions/userActions';
import classNames from "classnames";
import { NavDropdown, MenuItem, Button } from "react-bootstrap";
import { getSettings } from '../../actions/settingsActions';
import Immutable from 'immutable';
/* Assets */
import LogoImg from 'img/billrun-logo-tm.png';

class Navigator extends Component {
  constructor(props) {
    super(props);
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onCollapseSidebar = this.onCollapseSidebar.bind(this);
    this.openSetting = this.openSetting.bind(this);

    this.state = {
      uiOpenSetting: true,
      showCollapseButton: false,
      showFullMenu: true,
      activeNav: '',
      collapseSideBar: false
    };
  }

  componentWillMount() {
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize);
  }

  componentDidMount() {
    this.props.dispatch(getSettings('tenant'));
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
    e.preventDefault();
    this.props.userDoLogout().then(res => {
      this.props.router.push('/');
    });
  };

  setActiveNav = (e) => {
    const {id} = e.currentTarget;
    this.setState({activeNav: id, uiOpenSetting: true})
  };

  openSetting = (e) => {
    e.preventDefault();
    const {id} = e.currentTarget;
    this.setState({activeNav: id,uiOpenSetting: !this.state.uiOpenSetting});
  };

  onCollapseSidebar() {
    this.setState({collapseSideBar: !this.state.collapseSideBar});
  };

  render() {
    let overallNavClassName = classNames({
      'navbar navbar-default navbar-fixed-top': true,
      'collapse-sizebar': this.state.collapseSideBar
    });

    const settingsChildren =  ['settings', 'settingsProcessor','settingsGenerator','settingsGateway','collections','invoiceTemplate'];

    let settingIsActive = classNames({
      'active': this.state.activeNav==='settings-menu',
      'open': settingsChildren.indexOf(this.state.activeNav) > -1 || this.state.activeNav==='settings-menu',
      'has-second': true
    });

    return (
      <nav className={overallNavClassName} id="top-nav" role="navigation">
        <div className="navbar-header">
          <Link to="/" className="navbar-brand">
            <img src={LogoImg} style={{height: 22}}/>
          </Link>
          <Button bsSize="xsmall" id="btn-collapse-menu" onClick={this.onCollapseSidebar}>
            <i className="fa fa-chevron-left" />
            <i className="fa fa-chevron-left" />
          </Button>
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
                          className={(this.state.activeNav === "dashboard") ? "active" : ""} onClick={this.setActiveNav}>
                      <i className="fa fa-dashboard fa-fw" /><span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/plans" id="plans" className={(this.state.activeNav === "plans") ? "active" : ""}
                          onClick={this.setActiveNav}>
                      <i className="fa fa-cubes fa-fw" /><span>Plans</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/services" id="services" className={(this.state.activeNav === "services") ? "active" : ""}
                          onClick={this.setActiveNav}>
                      <i className="fa fa-puzzle-piece fa-fw" /><span>Services</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" id="products" className={(this.state.activeNav === "products") ? "active" : ""}
                          onClick={this.setActiveNav}>
                      <i className="fa fa-book fa-fw" /><span>Products</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/customers" id="customers"
                          className={(this.state.activeNav === "customers") ? "active" : ""} onClick={this.setActiveNav}>
                        <i className="fa fa-users fa-fw" /><span>Customers</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/usage" id="usage" className={(this.state.activeNav === "usage") ? "active" : ""}
                          onClick={this.setActiveNav}>
                      <i className="fa fa-list fa-fw" /><span>Usage</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/invoices" id="invoices" className={(this.state.activeNav === "invoices") ? "active" : ""}
                          onClick={this.setActiveNav}>
                      <i className="fa fa-file-text-o fa-fw" /><span>Invoices</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/users" id="users" className={(this.state.activeNav === "users") ? "active" : ""}
                          onClick={this.setActiveNav}>
                      <i className="fa fa-user fa-fw" /><span>User Management</span>
                    </Link>
                  </li>
                  <li className={settingIsActive}>
                    <a href  id="settings-menu" className={classNames({'active': !this.state.uiOpenSetting})} onClick={this.openSetting}>
                      <i className="fa fa-cog fa-fw" /><span>Settings</span><span className="fa arrow"></span></a>
                    {/*<ul className={classNames({'nav nav-second-level': true, 'collapse': this.state.uiOpenSetting})}>*/}
                    <ul className="nav nav-second-level">
                      <li>

                        <Link to="/settings" id="settings" className={(this.state.activeNav === "settings") ? "active" : ""}
                              onClick={this.setActiveNav}><span>General Settings</span></Link>
                      </li>
                      <li>
                        <Link to="/input_processors" id="settingsProcessor"
                              className={(this.state.activeNav === "settingsProcessor") ? "active" : ""}
                              onClick={this.setActiveNav}><span>Input Processors</span></Link>
                      </li>
                      <li>
                        <Link to="/export_generators" id="settingsGenerator"
                              className={(this.state.activeNav === "settingsGenerator") ? "active" : ""}
                              onClick={this.setActiveNav}><span>Export Generator</span></Link>
                      </li>
                      <li>
                        <Link to="/payment_gateways" id="settingsGateway"
                              className={(this.state.activeNav === "settingsGateway") ? "active" : ""}
                              onClick={this.setActiveNav}><span>Payment Gateways</span></Link>
                      </li>

                      <li>
                          <Link to="/collections" id="collections"
                              className={(this.state.activeNav === "collections") ? "active" : ""}
                              onClick={this.setActiveNav}><span>Collections</span></Link>
                      </li>

                      <li>
                        <Link to="/invoice-template" id="invoiceTemplate"
                              className={(this.state.activeNav === "invoiceTemplate") ? "active" : ""}
                              onClick={this.setActiveNav}>Invoice Template</Link>
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

function mapStateToProps(state) {
  console.log(state.settings.toJS());
  return {
    tenant: state.settings.get('tenant', Immutable.Map())
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    userDoLogout
  }, dispatch);
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigator));
