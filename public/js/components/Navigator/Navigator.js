import React, { Component } from 'react';
import { Link } from 'react-router';
import classNames from "classnames";

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
          <li className="dropdown">
            <a className="dropdown-toggle" data-toggle="dropdown" href="#">
              <i className="fa fa-user fa-fw"></i> <i className="fa fa-caret-down"></i>
            </a>
            <ul className="dropdown-menu dropdown-user">
              <li><a href="#"><i className="fa fa-user fa-fw"></i> User Profile</a>
              </li>
              <li><a href="#"><i className="fa fa-gear fa-fw"></i> Settings</a>
              </li>
              <li className="divider"></li>
              <li><a href="login.html"><i className="fa fa-sign-out fa-fw"></i> Logout</a>
              </li>
            </ul>
          </li>
        </ul>

        <div className="navbar-default sidebar" role="navigation">
          <div className="sidebar-nav navbar-collapse">
            <ul className="nav" id="side-menu">
              <li className="sidebar-search">
                <div className="input-group custom-search-form">
                  <input type="text" className="form-control" placeholder="Search..." />
                    <span className="input-group-btn">
                      <button className="btn btn-default" type="button">
                        <i className="fa fa-search"></i>
                      </button>
                    </span>
                </div>
              </li>
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
