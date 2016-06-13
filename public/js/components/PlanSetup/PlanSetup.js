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
import TextField   from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem    from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import DatePicker from 'material-ui/DatePicker';

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
    let { basic_settings, product_properties } = this.props;
    let { stepIndex } = this.state;

    let product_type_options = ["Metered", "Tiered"].map((type, key) => {
      return (<MenuItem value={type} primaryText={type} key={key} />)
    });

    let transaction_options = ["Every Month", "Every Week"].map((op, key) => {
      return (<MenuItem value={op} primaryText={op} key={key} />);
    });

    let each_period_options = ["Month", "Day"].map((op, key) => {
      return (<MenuItem value={op} primaryText={op} key={key} />);
    });
    
    const steps = [
      (<div className="BasicPlanSettings">
        <div className="BasicSettings">
          <h4>Basic Settings</h4>
          <div className="row">
            <div className="col-xs-6">
              <div className="box">
                <TextField id="PlanName"
                           value={basic_settings.PlanName}
                           onChange={this.onChangeFieldValue.bind(this, "basic_settings")}
                           floatingLabelText="Plan Name"
                />
              </div>
            </div>
            <div className="col-xs-4" >
              <div className="box">
                <TextField id="PlanCode"
                           value={basic_settings.PlanCode}
                           onChange={this.onChangeFieldValue.bind(this, "basic_settings")}
                           floatingLabelText="Plan Code"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <div className="box">
                <TextField id="PlanDescription"
                           value={basic_settings.PlanDescription}
                           onChange={this.onChangeFieldValue.bind(this, "basic_settings")}
                           floatingLabelText="Plan Description"
                           multiLine={true}
                           rows={3}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="Trial">
          <h4>Trial</h4>
          <div className="row">
            <div className="box">
              <SelectField
                  value={basic_settings.TrialTransaction}
                  id="TrialTransaction"
                  floatingLabelText="*Transaction"
                  onChange={this.onChangeSelectFieldValue.bind(this, "basic_settings", "TrialTransaction")}>
                { transaction_options }
              </SelectField>
            </div>
          </div>
        </div>
        <div className="PlanRecurring">
          <h4>Plan Recurring</h4>
          <div className="row">
            <div className="col-xs-3">
              <div className="box">
                <TextField id="PeriodicalRate"
                           value={basic_settings.PeriodicalRate}
                           onChange={this.onChangeFieldValue.bind(this, "basic_settings")}
                           floatingLabelText="Periodical Rate"
                />
              </div>
            </div>
            <div className="col-xs-3">
              <div className="box">
                <TextField id="Each"
                           value={basic_settings.Each}
                           onChange={this.onChangeFieldValue.bind(this, "basic_settings")}
                           floatingLabelText="Each"
                           type="number"
                />
              </div>
            </div>
            <div className="col-xs-3">
              <div className="box">
                <SelectField id="EachPeriod"
                             value={basic_settings.EachPeriod}
                             onChange={this.onChangeSelectFieldValue.bind(this, "basic_settings", "EachPeriod")}
                >
                  { each_period_options }
                </SelectField>
              </div>
            </div>
            <div className="col-xs-3">
              <div className="box">
                <TextField id="Cycle"
                           value={basic_settings.Cycle}
                           onChange={this.onChangeFieldValue.bind(this, "basic_settings")}
                           floatingLabelText="Cycle"
                           type="number"
                />
              </div>
            </div>
            <div className="col-xs-3">
              <div className="box">
                <DatePicker id="From"
                            hintText="From"
                            value={basic_settings.From}
                            onChange={this.onChangeDateFieldValue.bind(this, "basic_settings", "From")}
                />
              </div>
            </div>
            <div className="col-xs-3">
              <div className="box">
                <DatePicker id="To"
                            hintText="To"
                            value={basic_settings.To}
                            onChange={this.onChangeDateFieldValue.bind(this, "basic_settings", "To")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>),
      
      (<div className="AddItem">
        <h4>Add Item</h4>
        <div className="row">
          <div className="col-md-6">
            <div className="box">
            </div>
          </div>
        </div>
        { product_properties.map((prop, key) => {
            return (
              <div className="row" key={key}>
                <div className="col-xs-2">
                  <div className="box">
                    <SelectField
                        id="ProductType"
                        floatingLabelText="Product Type"
                        style={{width: "150px"}}
                        onChange={this.onChangeItemSelectFieldValue.bind(this, "ProductType", key)}
                        value={prop["ProductType"]}
                    >
                      {product_type_options}
                    </SelectField>
                  </div>
                </div>
                <div className="col-xs-2">
                  <div className="box">
                    <TextField
                        id="FlatRate"
                        floatingLabelText="Flat Rate"
                        type="number"
                        onChange={this.onChangeItemFieldValue.bind(this, "FlatRate", key)}
                        value={prop["FlatRate"]}
                        style={{width: "150px"}}
                    />
                  </div>
                </div>
                <div className="col-xs-2">
                  <div className="box">
                    <TextField
                        id="PerUnit"
                        floatingLabelText="Per Unit"
                        type="number"
                        style={{width: "150px"}}
                        onChange={this.onChangeItemFieldValue.bind(this, "PerUnit", key)}
                        value={prop["PerUnit"]}
                    />
                  </div>
                </div>
                <div className="col-xs-2">
                  <div className="box">
                    <TextField
                        id="Type"
                        floatingLabelText="Type"
                        type="text"
                        style={{width: "150px"}}
                        onChange={this.onChangeItemFieldValue.bind(this, "Type", key)}
                        value={prop["Type"]}
                    />
                  </div>
                </div>
                <div className="col-xs-2">
                  <div className="box">
                    <FloatingActionButton mini={true} secondary={true} style={{margin: "20px"}} onMouseUp={this.onRemoveProductProperties.bind(this, key)}>
                      <ContentRemove />
                    </FloatingActionButton>              
                  </div>
                </div>
              </div>
            );
          }) }
              <div className="col-xs-1">
                <div className="box">
                  <FloatingActionButton mini={true} style={{margin: "20px"}} onMouseUp={this.onAddProductProperties}>
                    <ContentAdd />
                  </FloatingActionButton>
                </div>
              </div>
      </div>
      ),
      
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
            <StepLabel>Add Item</StepLabel>
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
