import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { updatePlanField, updatePlanRecurringPriceField, getPlan, clearPlan, savePlan, addTariff } from '../../actions/planActions';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import Plan from './Plan';

class PlanSetup extends Component {
  constructor(props) {
    super(props);
    this.onChangeFieldValue = this.onChangeFieldValue.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);

    this.onAddTariff = this.onAddTariff.bind(this);
    this.onChangeRecurringPriceFieldValue = this.onChangeRecurringPriceFieldValue.bind(this);    
    this.onChangeItemFieldValue = this.onChangeItemFieldValue.bind(this);
    this.onAddProductProperties = this.onAddProductProperties.bind(this);
    this.onRemoveProductProperties = this.onRemoveProductProperties.bind(this);
    this.onChangeRecurringPriceCheckFieldValue = this.onChangeRecurringPriceCheckFieldValue.bind(this);
    this.onChangeFieldCheckValue = this.onChangeFieldCheckValue.bind(this);
    this.handleSave = this.handleSave.bind(this);

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
  
  onChangeFieldValue(section, e) {
    let { value, id } = e.target;
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
  
  onChangeDateFieldValue(section, id, e, value) {
    this.props.dispatch(updatePlanField(section, id, value));
  }
  
  /** PRODUCT **/
  onChangeItemFieldValue(id, idx, e) {
    let val = e.target.value;
    this.props.dispatch(updateProductPropertiesField(id, idx, val));
  }

  onAddProductProperties() {
    this.props.dispatch(addProductProperties());
  }

  onRemoveProductProperties(idx) {
    this.props.dispatch(removeProductProperties(idx));
  }
  /** **/

  handleSave() {
    this.props.dispatch(savePlan());
  }
  
  handleNext() {
    const {stepIndex} = this.state;
    if (this.state.finished) {
      this.save();
      return;
    }
    let finished = (stepIndex + 1) === 1;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: finished,
    });
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
              style={{marginRight: 12}} />
          <RaisedButton
              label="Save"
              primary={true}
              onTouchTap={this.handleSave} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return state.plan;
}  

export default connect(mapStateToProps)(PlanSetup);
