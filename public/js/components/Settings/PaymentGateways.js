import React, { Component } from 'react';

export default class PaymentGateways extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data, gateways } = this.props;

    return (
      <div>
	{gateways.map((gateway, key) => (
	  <div key={key}>
	    { getaway.get('name') }
	  </div>
	 ))
	}
      </div>
    );
  }
}
