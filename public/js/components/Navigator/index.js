import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Navigator extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="navbar navbar-default navigator">
        <div className="container-fluid">
          <div className="navbar-collapse collapse">
            <ul className="nav navbar-nav">
              <li>
                <Link to="dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="plan-setup">Plan Setup</Link>
              </li>
              <li>
                <Link to="plans-items">Plans & Items</Link>
              </li>
              <li>
                <Link to="pay-management">Pay Management</Link>
              </li>
              <li>
                <Link to="subscribers">Subscribers</Link>
              </li>
              <li>
                <Link to="invoice">Invoice Listings</Link>
              </li>
              <li>
                <Link to="reports">Reports</Link>
              </li>
              <li>
                <Link to="settings">Settings</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
