import React, { Component } from 'react';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="jumbotron hero-unit">
    		<h1>BillRun!</h1>
    		<p>The powerful Billing system.</p>
    		<p><a href="http://billrun.net" target="_blank" className="btn btn-primary btn-large">Learn more »</a></p>
       </div>
    );
  }
}
