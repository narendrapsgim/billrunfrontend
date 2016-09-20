import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSettings, saveSettings, selectPaymentGateway, changePaymentGatewayParam } from '../../actions/settingsActions';
import { getList } from '../../actions/listActions';
import Immutable from 'immutable';

import PaymentGateway from './PaymentGateway';

class PaymentGateways extends Component {
  constructor(props) {
    super(props);

    this.onCheckPaymentGateway = this.onCheckPaymentGateway.bind(this);
    this.onChangeParam = this.onChangeParam.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getSettings("payment_gateways"));
    this.props.dispatch(getList("supported_gateways", {api: "supportedgateways"}));
  }

  onCheckPaymentGateway(gateway_name, e) {
    const { checked } = e.target;
    this.props.dispatch(selectPaymentGateway(gateway_name, checked));
  }

  onChangeParam(gateway_name, param, e) {
    const { value } = e.target;
    this.props.dispatch(changePaymentGatewayParam(gateway_name, param, value));
  }

  onSave() {
    this.props.dispatch(saveSettings('payment_gateways', this.props.settings));
  }
  
  render() {
    const { supported_gateways, settings } = this.props;
    const payment_gateways = settings.get('payment_gateways') || Immutable.Map();
    const gateways_view = supported_gateways.map((gateway, key) => {
      const curr = payment_gateways.find(pg => pg.get('name') === gateway.get('name'));
      return (
	<PaymentGateway key={key} curr={curr} gateway={gateway} onCheck={this.onCheckPaymentGateway} onChangeParam={this.onChangeParam} />
      );
    });

    return (
      <div className="panel panel-default">
	<div className="panel-heading">
	  Available payment gateways
	</div>
	<div className="panel-body">
	  <form className="form-horizontal">
	    { gateways_view }
	    <div className="form-group">
	      <div className="col-lg-12">
		<button className="btn btn-primary" onClick={this.onSave}>Save</button>
	      </div>
	    </div>
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
