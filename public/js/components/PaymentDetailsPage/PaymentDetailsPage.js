import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Immutable from 'immutable';

import { updatePaymentDetailsField, submitPaymentDetails } from '../../actions/paymentDetailsActions';
import { getSettings } from '../../actions/settingsActions';
import { getPlans } from '../../actions/plansActions';
import Typeahead from 'react-bootstrap-typeahead';

import Field from '../Field';

class PaymentDetailsPage extends Component {
  constructor(props) {
    super(props);

    this.onUpdateField = this.onUpdateField.bind(this);
    this.onSelectPlan = this.onSelectPlan.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getSettings('subscribers'));
    this.props.dispatch(getPlans({}));
  }

  onUpdateField(e) {
    const { id, value } = e.target;
    this.props.dispatch(updatePaymentDetailsField(id, value));
  }

  onSelectPlan(id, val) {
    this.props.dispatch(updatePaymentDetailsField(id, val[0].name));
  }
  
  onSubmit(e) {
    this.props.dispatch(submitPaymentDetails());
  }

  render() {
    const { settings, plans } = this.props;

    const available_plans = plans.map((plan, key) => {
      return Immutable.fromJS({
        id: plan.get('name'),
        name: plan.get('name')
      });
    }).toJS();
    
    const accountInfo = settings.getIn(['account', 'fields']).map((field, key) => {
      if (field.get('display') === false) return (null);
      return (
        <div className="row" key={key}>
          <div className="col-md-3" key={key}>
            <label>{_.capitalize(field.get('field_name'))}</label>
            <Field id={field.get('field_name')}
                   onChange={this.onUpdateField} />
          </div>
        </div>
      );
    });

    const subscriberInfo = settings.getIn(['subscriber', 'fields']).map((field, key) => {
      if (field.get('display') === false) return (null);
      return (
        <div className="row" key={key}>
          <div className="col-md-3" key={key}>
            <label>{_.capitalize(field.get('field_name'))}</label>
            <Field id={field.get('field_name')}
                   onChange={this.onUpdateField} />
          </div>
        </div>
      );
    });

    return (
      <div>
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h4>Account Information</h4>
          </div>
          <div className="panel-body">
            { accountInfo }
          </div>
        </div>
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h4>Plan Information</h4>
          </div>
          <div className="panel-body">
            <div className="row">
              <div className="col-md-3">
                <label>Plan</label>
                <Typeahead options={available_plans}
                           labelKey="name"
                           maxHeight={150}
                           onChange={this.onSelectPlan.bind(this, "plan")} />
              </div>
            </div>
          </div>
        </div>
        <div className="pull-right">
          <button className="btn btn-primary" onClick={this.onSubmit}>Submit</button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    paymentDetails: state.paymentDetails,
    settings: state.settings,
    plans: state.plans
  };
}

export default connect(mapStateToProps)(PaymentDetailsPage);
