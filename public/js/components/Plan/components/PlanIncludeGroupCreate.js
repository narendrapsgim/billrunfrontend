import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, FormGroup, FormControl, ControlLabel, HelpBlock, Button,
  Panel, Col, Row, Collapse, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';

import UsagetypeSelect from './UsagetypeSelect';
import Include from './Include';
import Products from './Products';
import ProductSearchByUsagetype from './ProductSearchByUsagetype';

import {
  getExistGroupProductsByUsageTypes,
  addGroupProducts,
  getAllGroup } from '../../../actions/planGroupsActions';
import { addPlanInclude } from '../../../actions/planActions';


class PlanIncludeGroupCreate extends Component {

  defaultSate = {
    name: '', usage: '', include: '', products: [],
    error : '',
    stepIndex: 0, open: false
  }

  errors = {
    name: {
      required: 'Group name is required',
      exist: 'Group name already exist',
      allowedCharacters: 'Group name contains illegal characters, name should contain only alphabets, numbers and underscore(A-Z, 0-9, _)',
    },
    usage: {
      required: 'Usage type is required',
      exist: 'Group with same name and usage type already exist'
    },
    include: {
      required: 'Inclide is required',
      allowedCharacters: 'Include must be positive number or Unlimited',
    },
    products: {
      required : 'Products is required',
    }
  }

  state = Object.assign({}, this.defaultSate);

  validateStep = (step) => {
    switch (step) {
      case 0:
        const { existingGroups } = this.props;
        if( this.state.name === '' ){
          this.setState({ error: this.errors.name.required });
          return false;
        }
        if(existingGroups && existingGroups.includes(this.state.name)){
          this.setState({ error: this.errors.name.exist });
          return false;
        }
        if(!globalSetting.keyUppercaseRegex.test(this.state.name)){
          this.setState({ error: this.errors.name.allowedCharacters });
          return false;
        }
        return true;
      case 1:
        if( this.state.usage === '' ){
          this.setState({ error: this.errors.usage.required });
          return false;
        }
        // if( this.props.plan.getIn(['include', 'groups']) && this.props.plan.getIn(['include', 'groups']).some( (group, name) => (name === this.state.name && group.keySeq().includes( this.state.usage )) ) ){
        //   this.setState({ error: this.errors.usage.exist });
        //   return false;
        // }
        return true;
      case 2:
        if( this.state.include === '' ){
          this.setState({ error: this.errors.include.required });
          return false;
        }
        if(!( /^\d+(\.\d+)?$/.test( this.state.include )) && this.state.include !== 'UNLIMITED' ){
          this.setState({ error: this.errors.include.allowedCharacters });
          return false;
        }
        return true;
      case 3:
        if( this.state.products.length < 1 ){
          this.setState({ error: this.errors.products.required });
          return false;
        }
        return true;
      default: return true;

    }
  }

  getExistingGroupProducts = (name, usageType) =>{
    getExistGroupProductsByUsageTypes(name, usageType).then(
      (response) => {
        let existingProd = _.values(response.data[0].data.details).map( (prod) => prod.key);
        if (typeof existingProd !== 'undefined' && Array.isArray(existingProd) && existingProd.length > 0){
          this.setState({products : [...this.state.products, existingProd]});
        }
      }
    )
  }

  onChangeGroupName = (e) => {
    const name = e.target.value.toUpperCase();
    const error = (name.length && !globalSetting.keyUppercaseRegex.test(name)) ? this.errors.name.allowedCharacters : '';
    this.setState({name, error});
  }

  onChangeUsageType = (newValue) => {
    this.setState({usage: newValue, products: [], error:''});
    if(newValue.length){
      this.getExistingGroupProducts(this.state.name, newValue);
    }
  }

  onChangeInclud = (newValue) => {
    const error =  (!( /^[+-]?\d+(\.\d+)?$/.test( newValue )) && newValue !== 'UNLIMITED' ) ? this.errors.include.allowedCharacters : '' ;
    this.setState({include: newValue, error});
  }

  onAddProduct = (key) => {
    const products = [...this.state.products, key];
    this.setState({products, error: ''});
  }

  onRemoveProduct = (key) => {
    const products = this.state.products.filter( (product) => key !== product);
    this.setState({products, error: ''});
  }

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1, error:''});
    }
  }

  handleNext = () => {
    const {stepIndex} = this.state;
    if(this.validateStep(stepIndex)){
      this.setState({
        stepIndex: stepIndex + 1,
      });
    }
  };

  resetState = (open = true) => {
    this.setState(Object.assign({}, this.defaultSate, {open}));
  }

  handleCancel = () => {
    this.resetState(false);
  }

  handleFinish = () => {
    const {stepIndex} = this.state;
    if(this.validateStep(stepIndex)){
      this.props.addPlanInclude(this.state.name, this.state.usage, this.state.include);
      this.props.addGroupProducts(this.state.name, this.state.usage, this.state.products);
      this.resetState(false);
    }
  };

  handleReset = () => {
    this.resetState();
  }

  handleToggleBoby = () => {
    this.setState({ open: !this.state.open })
  }

  getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <FormGroup validationState={this.state.error.length > 0 ? "error" : '' }>
            <ControlLabel>Group Name</ControlLabel>
              <FormControl type="text" placeholder="Enter Group Name.." value={this.state.name} onChange={this.onChangeGroupName}/>
              <h5><small>* Group name should be unique for all plans</small></h5>
              { this.state.error.length > 0 ? <HelpBlock>{this.state.error}</HelpBlock> : ''}
          </FormGroup>
        );
      case 1:
        return (
          <FormGroup validationState={this.state.error.length > 0 ? "error" : ''} >
            <ControlLabel>Usage Type</ControlLabel>
            <UsagetypeSelect onChangeUsageType={this.onChangeUsageType} value={this.state.usage}/>
            { this.state.error.length > 0 ? <HelpBlock>{this.state.error}</HelpBlock> : ''}
          </FormGroup>
        );
      case 2:
        return (
          <FormGroup validationState={this.state.error.length > 0 ? "error" : ''} >
            <ControlLabel>Includes</ControlLabel>
            <Include onChangeInclud={this.onChangeInclud} value={this.state.include} />
            { this.state.error.length > 0 ? <HelpBlock>{this.state.error}</HelpBlock> : ''}
          </FormGroup>
        );
      case 3:
      return (
          <FormGroup validationState={this.state.error.length > 0 ? "error" : ''}>
            <ControlLabel>Products</ControlLabel>
              {this.state.products.length ?
                <Products
                  onRemoveProduct={this.onRemoveProduct}
                  products={this.state.products}
                />
              : <p style={{marginTop:8}}>No products in group ...</p>}

              <div style={{ marginTop: 10, minWidth: 250, width: '100%', height: 42 }}>
                <ProductSearchByUsagetype
                  addRatesToGroup={this.onAddProduct}
                  usaget={this.state.usage}
                  products={this.state.products}
                />
              </div>
              { this.state.error.length > 0 ? <HelpBlock>{this.state.error}</HelpBlock> : ''}
          </FormGroup>);
      default:
        return '...';
    }
  }

  renderTitle = () => {
    return "Create New Group";
  }

  renderTitleRight = () => {
    const { open } = this.state;

    if( !open ) {
      return null;
    }

    return (
      <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">Cancel</Tooltip>}>
        <i className="fa fa-times" onClick={ this.handleCancel } style={{cursor: "pointer"}} ></i>
      </OverlayTrigger>
    );
  }

  renderTitleLeft = () => {
    return (
      <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">Create new gruop</Tooltip>}>
        <i className="fa fa-plus-circle fa-lg"
          onClick={this.handleToggleBoby}
          style={{cursor: "pointer", color: 'green'}} >
        </i>
      </OverlayTrigger>
    );
  }

  renderContent = () => {
    const { stepIndex, open } = this.state;
    return (
      <div>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Set Name</StepLabel>
          </Step>
          <Step>
            <StepLabel>Set Usage Type</StepLabel>
          </Step>
          <Step>
            <StepLabel>Set Includes</StepLabel>
          </Step>
          <Step>
            <StepLabel>Set Products</StepLabel>
          </Step>
        </Stepper>

        <div style={{marginTop: 25, marginBottom: 25}}>
          <Form>
            {this.getStepContent(stepIndex)}
          </Form>
        </div>

        <Row>
          <Col lg={3} md={3} sm={3} xs={3} className="text-left">
            <Button bsStyle="danger" onClick={ this.handleReset }>Reset</Button>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6} lgOffset={3} mdOffset={3} smOffset={3} xsOffset={3} className="text-right">
            <Button onClick={ this.handlePrev } style={{marginRight:10}}>Back</Button>
            { (stepIndex === 3)
              ? <Button bsStyle="success" onClick={ this.handleFinish }>Add Group</Button>
              : <Button bsStyle="success" onClick={ this.handleNext }>Next</Button>
            }
           </Col>
        </Row >
      </div>
    );
  }

  render() {
    const { stepIndex, open } = this.state;
    return (
      <div>
        <Row>
          <Col lg={1} md={1} sm={1} xs={6} className="text-left">
            {this.renderTitleLeft()}
          </Col>
          <Col lg={10} md={10} sm={10} xsHidden className="text-center">
            <h4 style={{ margin: 0 }}><small>{this.renderTitle()}</small></h4>
          </Col>
          <Col lg={1} md={1} sm={1} xs={6} className="text-right">
            {this.renderTitleRight()}
          </Col>
        </Row>

        <Collapse in={open}>
          <div style={{backgroundColor: "rgba(0, 0, 0, 0.027451)", padding: 25, borderRadius: 5, marginTop: 15}}>
            {this.renderContent()}
          </div>
        </Collapse>
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addGroupProducts,
    addPlanInclude }, dispatch);
}
function mapStateToProps(state, props) {
  return  { plan: state.plan };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanIncludeGroupCreate);
