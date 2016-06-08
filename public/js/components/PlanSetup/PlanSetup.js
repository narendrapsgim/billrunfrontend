import React, { Component } from 'react';

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

import BasicPlanSettings from '../BasicPlanSettings';

class PlanSetup extends Component {
  constructor(props) {
    super(props);
    this.onChangeFieldValue = this.onChangeFieldValue.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);

    this.state = {
      stepIndex: 0,
      finished: 0,
      product_properties: [{
        ProductType:'',
        FlatRate:'',
        PerUnit:'',
        Type:''
      }]
    };

    this.onChangeItemFieldValue = this.onChangeItemFieldValue.bind(this);
    this.onAddProductProperties = this.onAddProductProperties.bind(this);
    this.onRemoveProductProperties = this.onRemoveProductProperties.bind(this);
  }

  onChangeFieldValue(e, idx, value) {
    let { id } = e.target;
    this.setState({[id]: value});
  }

  /** ITEM **/
  onChangeItemFieldValue(id, idx, e, val) {
    let p = this.state.product_properties;
    p[idx][id] = val;
    this.setState({product_properties: p});
  }

  onAddProductProperties() {
    let p = this.state.product_properties;
    p.push({
      ProductType:0,
      FlatRate:'',
      PerUnit:'',
      Type:''      
    })
    this.setState({product_properties: p});
  }

  onRemoveProductProperties(idx) {
    let p = this.state.product_properties;
    p.splice(idx, 1);
    this.setState({product_properties: p});
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
    let { stepIndex, product_properties } = this.state;


    let product_type_options = ["Metered", "Tiered"].map((type, key) => {
      return (<MenuItem value={key} primaryText={type} key={key} />)
    });
    
    this.steps = [
      (<BasicPlanSettings onChange={this.onChangeFieldValue} />),
      (<div className="AddItem">
        <h4>Add Item</h4>
        <div className="row">
          <div className="col-md-6">
            <div className="box">
            </div>
          </div>
        </div>
        { this.state.product_properties.map((prop, key) => {
            return (
              <div className="row" key={key}>
                <div className="col-xs-2">
                  <div className="box">
                    <SelectField
                        id="ProductType"
                        floatingLabelText="Product Type"
                        style={{width: "150px"}}
                        onChange={this.onChangeItemFieldValue.bind(this, "ProductType", key)}
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

    let currentStepContents = this.steps[stepIndex];

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
        <div style={{marginTop: 12}}>
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

export default PlanSetup;
