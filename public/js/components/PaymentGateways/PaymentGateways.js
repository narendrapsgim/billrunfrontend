import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSettings, addPaymentGateway, removePaymentGateway, updatePaymentGateway } from '../../actions/settingsActions';
import { apiBillRun } from '../../common/Api';
import { showSuccess, showDanger } from '../../actions/alertsActions';
import { getList, getPaymentGateways } from '../../actions/listActions';
import Immutable from 'immutable';

import PaymentGateway from './PaymentGateway';

class PaymentGateways extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(getSettings("payment_gateways"));
    this.props.dispatch(getPaymentGateways());
  }

  onSaveGatewayParams = (gateway, enabled) => {
    const { dispatch } = this.props;
    const query = {
      api: "settings",
      params: [
	{ category: "payment_gateways" },
	{ action: "set" },
	{ data: JSON.stringify(gateway) }
      ]
    };

    apiBillRun(query).then(
      success => {
	dispatch(showSuccess("Payment gateway enabled!"));
	if (!enabled) dispatch(addPaymentGateway(gateway));
	else dispatch(updatePaymentGateway(gateway));
      },
      failure => {
	dispatch(showDanger("Error saving payment gateway"));
      }
    ).catch(
      error => {
	dispatch(showDanger("Network error - please try again"));
      }
    );
  };

  onDisableGateway = (name) => {
    const { dispatch } = this.props;
    const query = {
      api: "settings",
      params: [
	{ category: "payment_gateways" },
	{ action: "unset" },
	{ data: JSON.stringify({name}) }
      ]
    };

    apiBillRun(query).then(
      success => {
	dispatch(showSuccess("Payment gateway disabled!"));
	dispatch(removePaymentGateway(name));
      },
      failure => {
	console.log('failed!', failure);
	dispatch(showDanger("Error saving payment gateway"));
      }
    ).catch(
      error => {
	console.log(error);
	dispatch(showDanger("Network error - please try again"));
      }
    );
  };

  render() {
    const { supported_gateways, settings } = this.props;
    const payment_gateways = settings.get('payment_gateways') || Immutable.List();

    return (
      <div className="panel panel-default">
	<div className="panel-heading">
	  Available payment gateways
	</div>
	<div className="panel-body">
	  <form className="form-horizontal">
	    { supported_gateways.filter(pg => pg.get('supported') == '1').map((gateway, key) => {
		const enabled = payment_gateways.find(pg => pg.get('name') === gateway.get('name'));
		return (
		  <div className="col-lg-4 col-md-4" key={key}>
		    <PaymentGateway enabled={enabled}
				    settings={gateway}
				    onDisable={this.onDisableGateway}
				    onSaveParams={this.onSaveGatewayParams} />
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
