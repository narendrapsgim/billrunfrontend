import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updatePlanField, updateProductPropertiesField, addProductProperties, removeProductProperties, getPlan, clearPlan } from '../../actions';

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

    this.onChangeItemFieldValue = this.onChangeItemFieldValue.bind(this);
    this.onAddProductProperties = this.onAddProductProperties.bind(this);
    this.onRemoveProductProperties = this.onRemoveProductProperties.bind(this);
  }

  componentWillMount() {
    let { plan_id } = this.props.params;
    if (plan_id) {
      this.props.dispatch(getPlan(plan_id));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearPlan());
  }
  
  onChangeFieldValue(section, e, value) {
    let id = e.target.id;
    this.props.dispatch(updatePlanField(section, id, value));
  }
  
  onChangeSelectFieldValue(section, id, e, sidx, value) {
    this.props.dispatch(updatePlanField(section, id, value));
  }

  onChangeDateFieldValue(section, id, e, value) {
    this.props.dispatch(updatePlanField(section, id, value));
  }
  
  /** PRODUCT **/
  onChangeItemFieldValue(id, idx, e, val) {
    this.props.dispatch(updateProductPropertiesField(id, idx, val));
  }

  onChangeItemSelectFieldValue(id, idx, e, sidx, val) {
    this.props.dispatch(updateProductPropertiesField(id, idx, val));
  }

  onAddProductProperties() {
    this.props.dispatch(addProductProperties());
  }

  onRemoveProductProperties(idx) {
    this.props.dispatch(removeProductProperties(idx));
  }
  /** **/
  
  handleNext() {
    const {stepIndex} = this.state;
    if (this.state.finished) {
      console.log('save now');
      return;
    }
    let finished = (stepIndex + 1) >= 2;
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
    /** TODO: Abstract away all the rendering from this component, make it a 'smart' component so that rendering can be reused. */

    let { basic_settings, product_properties } = this.props;
    let { stepIndex } = this.state;
    
    const steps = [
      (<Plan onChangeFieldValue={this.onChangeFieldValue} onChangeSelectFieldValue={this.onChangeSelectFieldValue} onChangeDateFieldValue={this.onChangeDateFieldValue} />),
      (<Product onChangeItemSelectFieldValue={this.onChangeItemSelectFieldValue} onChangeItemFieldValue={this.onChangeItemFieldValue} onAddProductProperties={this.onAddProductProperties} onRemoveProductProperties={this.onRemoveProductProperties} />),
      (<div><h4>Add Discounts</h4></div>)
    ];    

    let currentStepContents = steps[stepIndex];

    return (
      <div className="PlanSetup">
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Plan Settings</StepLabel>
          </Step>
          <Step>
            <StepLabel>Add Product</StepLabel>
          </Step>
          <Step>
            <StepLabel>Add Discount or Coupon</StepLabel>
          </Step>
        </Stepper>
        <Card>
          <CardText>
            { currentStepContents }
          </CardText>
        </Card>
        <div style={{marginTop: 12, float: "right"}}>
          <FlatButton
              label="Back"
              disabled={stepIndex === 0}
              onTouchTap={this.handlePrev}
              style={{marginRight: 12}}
          />
          <RaisedButton
              label={stepIndex === 2 ? 'Save' : 'Next'}
              primary={true}
              onTouchTap={this.handleNext}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return state.plan || {};
}  

export default connect(mapStateToProps)(PlanSetup);
