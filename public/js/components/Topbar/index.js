import React, { Component } from 'react';

export default class Topbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="navbar navbar-default navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">BillRun!</a>
          </div>
          <div className="collapse navbar-collapse">
            <div className="navbar-header navbar-right">
              <a className="navbar-brand" href="#">User Name (Avatar)</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
