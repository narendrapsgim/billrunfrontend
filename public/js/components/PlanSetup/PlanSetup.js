import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import { updatePlanField, updatePlanRecurringPriceField, getPlan, clearPlan, savePlan, addTariff } from '../../actions/planActions';

import Plan from './Plan';

class PlanSetup extends Component {
  constructor(props) {
    super(props);
    this.onChangeFieldValue = this.onChangeFieldValue.bind(this);
    this.handleBack = this.handleBack.bind(this);

    this.onAddTariff = this.onAddTariff.bind(this);
    this.onChangeRecurringPriceFieldValue = this.onChangeRecurringPriceFieldValue.bind(this);    
    this.onChangeRecurringPriceCheckFieldValue = this.onChangeRecurringPriceCheckFieldValue.bind(this);
    this.onChangeFieldCheckValue = this.onChangeFieldCheckValue.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.onChangeDateFieldValue = this.onChangeDateFieldValue.bind(this);

    this.state = {
      stepIndex: 0,
      finished: 0
    };
  }

  componentWillMount() {
    let { plan_id } = this.props.location.query;
    if (plan_id) {
      this.props.dispatch(getPlan(plan_id));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearPlan());
  }
  
  onChangeFieldValue(section, e) {
    const { value, id } = e.target;
    this.props.dispatch(updatePlanField(section, id, value));
  }

  onChangeFieldCheckValue(section, e) {
    const { checked, id } = e.target;
    this.props.dispatch(updatePlanField(section, id, checked));
  }
  
  onChangeRecurringPriceFieldValue(id, idx, e, val) {
    let value = val ? val : e.target.value;
    this.props.dispatch(updatePlanRecurringPriceField(id, idx, value));
  }
  
  onChangeRecurringPriceCheckFieldValue(id, idx, e) {
    this.props.dispatch(updatePlanRecurringPriceField(id, idx, e.target.checked));
  }

  onAddTariff() {
    this.props.dispatch(addTariff());
  }
  
  onChangeDateFieldValue(section, id, value) {
    this.props.dispatch(updatePlanField(section, id, value));
  }

  handleSave() {
    const { action } = this.props.location.query;
    this.props.dispatch(savePlan(this.props, action));
    browserHistory.goBack();
  }
  
  handleBack() {
    browserHistory.goBack();
  }
  
  render() {
    return (
      <div className="PlanSetup container">
        <h3>Billing Plan</h3>
        <div className="contents bordered-container">
          <Plan onChangeFieldValue={this.onChangeFieldValue} onChangeDateFieldValue={this.onChangeDateFieldValue} onChangeRecurringPriceFieldValue={this.onChangeRecurringPriceFieldValue} onAddTariff={this.onAddTariff} onChangeRecurringPriceCheckFieldValue={this.onChangeRecurringPriceCheckFieldValue} onChangeFieldCheckValue={this.onChangeFieldCheckValue} basicSettings={this.props.basic_settings} />
        </div>
        <div style={{marginTop: 12, float: "right"}}>
          <FlatButton
              label="Cancel"
              onTouchTap={this.handleBack}
              style={{marginRight: 12}}
          />
          <RaisedButton
              label='Save'
              primary={true}
              onTouchTap={this.handleSave}
          />          
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return state.plan;
}  

export default connect(mapStateToProps)(PlanSetup);
