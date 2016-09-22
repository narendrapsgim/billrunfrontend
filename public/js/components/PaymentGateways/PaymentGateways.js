import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSettings, saveSettings } from '../../actions/settingsActions';
import { getList } from '../../actions/listActions';
import Immutable from 'immutable';

import PaymentGateway from './PaymentGateway';

class PaymentGateways extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(getSettings("payment_gateways"));
    this.props.dispatch(getList("supported_gateways", {api: "supportedgateways"}));
  }
  
  render() {
    const { supported_gateways, settings } = this.props;
    const payment_gateways = settings.get('payment_gateways') || Immutable.Map();

    return (
      <div className="panel panel-default">
	<div className="panel-heading">
	  Available payment gateways
	</div>
	<div className="panel-body">
	  <form className="form-horizontal">
	    { supported_gateways.map((gateway, key) => {
		const enabled = payment_gateways.find(pg => pg.get('name') === gateway.get('name'));
		return (
		  <div className="col-lg-4" key={key}>
		    <PaymentGateway enabled={enabled} settings={gateway} />
		  </div>
		);
	      }) }
	  </form>
	</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    supported_gateways: state.list.get('supported_gateways') || Immutable.List()
  };
}

export default connect(mapStateToProps)(PaymentGateways);
