import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updatePlanField, updatePlanRecurringPriceField, updateProductPropertiesField, addProductProperties, removeProductProperties, getPlan, clearPlan, savePlan, addTariff } from '../../actions/planActions';

import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { Card, CardHeader, CardText } from 'material-ui/Card';

import Product from '../ProductSetup/Product';
import Plan from './Plan';

class PlanSetup extends Component {
  constructor(props) {
    super(props);
    this.onChangeFieldValue = this.onChangeFieldValue.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);

    this.state = {
      stepIndex: 0,
      finished: 0
    };

    this.onAddTariff = this.onAddTariff.bind(this);
    this.onChangeRecurringPriceFieldValue = this.onChangeRecurringPriceFieldValue.bind(this);    
    this.onChangeItemFieldValue = this.onChangeItemFieldValue.bind(this);
    this.onAddProductProperties = this.onAddProductProperties.bind(this);
    this.onRemoveProductProperties = this.onRemoveProductProperties.bind(this);
    this.onChangeRecurringPriceCheckFieldValue = this.onChangeRecurringPriceCheckFieldValue.bind(this);
    this.handleSave = this.handleSave.bind(this);
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
  
  shouldComponentUpdate(nextProps, nextState) {
    /* Only re-render the component when switching steps in the stepper */
    return nextState.stepIndex !== this.state.stepIndex; 
  }
  
  onChangeFieldValue(section, e) {
    let {value, id } = e.target;
    this.props.dispatch(updatePlanField(section, id, value));
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
  };

  handlePrev() {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1, finished: 0});
    }
  };
  
  render() {
    let { stepIndex } = this.state;

    const steps = [
      (<Plan onChangeFieldValue={this.onChangeFieldValue} onChangeDateFieldValue={this.onChangeDateFieldValue} onChangeRecurringPriceFieldValue={this.onChangeRecurringPriceFieldValue} onAddTariff={this.onAddTariff} onChangeRecurringPriceCheckFieldValue={this.onChangeRecurringPriceCheckFieldValue} basicSettings={this.props} />),
      (<Product onChangeItemFieldValue={this.onChangeItemFieldValue} onAddProductProperties={this.onAddProductProperties} onRemoveProductProperties={this.onRemoveProductProperties} />)
    ];

    let currentStepContents = steps[stepIndex];

    return (
      <div className="PlanSetup container">
        <h3>Billing Plan</h3>
        <div className="contents bordered-container">
          { steps[0] }
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
    /* 
       return (
       <div className="PlanSetup container">
       <h3>Billing Plan</h3>
       <Stepper activeStep={stepIndex}>
       <Step>
       <StepLabel>Plan Settings</StepLabel>
       </Step>
       <Step>
       <StepLabel>Add Product</StepLabel>
       </Step>
       </Stepper>
       <div className="contents bordered-container">
       { currentStepContents }
       </div>
       <div style={{marginTop: 12, float: "right"}}>
       <FlatButton
       label="Back"
       disabled={stepIndex === 0}
       onTouchTap={this.handlePrev}
       style={{marginRight: 12}}
       />
       <RaisedButton
       label={stepIndex === 1 ? 'Save' : 'Next'}
       primary={true}
       onTouchTap={this.handleNext}
       />
       </div>
       </div>
       ); */
  }
}

function mapStateToProps(state, props) {
  return state.plan || {};
}  

export default connect(mapStateToProps)(PlanSetup);
