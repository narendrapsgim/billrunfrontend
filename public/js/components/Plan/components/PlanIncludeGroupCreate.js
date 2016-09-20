import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import FlatButton from 'material-ui/FlatButton';
import * as Colors from 'material-ui/styles/colors'
import FontIcon from 'material-ui/FontIcon';
import { Form, FormControl, FormGroup, Col, ControlLabel, Collapse, HelpBlock } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import UsagetypeSelect from './UsagetypeSelect';
import Include from './Include';
import Products from './Products';
import ProductSearchByUsagetype from './ProductSearchByUsagetype';

import { addPlanInclude } from '../../../actions/planActions';
import { addGroupProducts, getExistGroupProductsByUsageTypes, getAllGroup } from '../../../actions/planGroupsActions';


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

  constructor(props) {
    super(props);

    this.resetState = this.resetState.bind(this);
    this.validateStep = this.validateStep.bind(this);
    this.getExistingGroupProducts = this.getExistingGroupProducts.bind(this);

    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
    this.handleToggleBoby = this.handleToggleBoby.bind(this);

    this.getStepContent = this.getStepContent.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
    this.renderTitleRight = this.renderTitleRight.bind(this);
    this.renderControllers = this.renderControllers.bind(this);
    this.renderContent = this.renderContent.bind(this);

    this.onChangeGroupName = this.onChangeGroupName.bind(this);
    this.onChangeUsageType = this.onChangeUsageType.bind(this);
    this.onChangeInclud = this.onChangeInclud.bind(this);
    this.onAddProduct = this.onAddProduct.bind(this);
    this.onRemoveProduct = this.onRemoveProduct.bind(this);

    this.state = Object.assign({}, this.defaultSate);
  }

  validateStep(step){
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

  getExistingGroupProducts(name, usageType){
    getExistGroupProductsByUsageTypes(name, usageType).then(
      (response) => {
        let existingProd = _.values(response.data[0].data.details).map( (prod) => prod.key);
        if (typeof existingProd !== 'undefined' && Array.isArray(existingProd) && existingProd.length > 0){
          this.setState({products : [...this.state.products, existingProd]});
        }
      }
    )
  }

  onChangeGroupName(e){
    const name = e.target.value.toUpperCase();
    const error = (name.length && !globalSetting.keyUppercaseRegex.test(name)) ? this.errors.name.allowedCharacters : '';
    this.setState({name, error});
  }

  onChangeUsageType(newValue){
    this.setState({usage: newValue, products: [], error:''});
    if(newValue.length){
      this.getExistingGroupProducts(this.state.name, newValue);
    }
  }

  onChangeInclud(newValue){
    const error =  (!( /^[+-]?\d+(\.\d+)?$/.test( newValue )) && newValue !== 'UNLIMITED' ) ? this.errors.include.allowedCharacters : '' ;
    this.setState({include: newValue, error});
  }

  onAddProduct(key){
    const products = [...this.state.products, key];
    this.setState({products, error: ''});
  }

  onRemoveProduct(key){
    const products = this.state.products.filter( (product) => key !== product);
    this.setState({products, error: ''});
  }

  handlePrev(){
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1, error:''});
    }
  }

  handleNext(){
    const {stepIndex} = this.state;
    if(this.validateStep(stepIndex)){
      this.setState({
        stepIndex: stepIndex + 1,
      });
    }
  };

  resetState(open = true){
    this.setState(Object.assign({}, this.defaultSate, {open}));
  }

  handleCancel(){
    this.resetState(false);
  }

  handleFinish(){
    const {stepIndex} = this.state;
    if(this.validateStep(stepIndex)){
      this.props.addPlanInclude(this.state.name, this.state.usage, this.state.include);
      this.props.addGroupProducts(this.state.name, this.state.usage, this.state.products);
      this.resetState(false);
    }
  };

  handleReset(){
    this.resetState();
  }

  handleToggleBoby(){
    this.setState({ open: !this.state.open })
  }

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <FormGroup validationState={this.state.error.length > 0 ? "error" : '' }>
            <Col componentClass={ControlLabel} sm={4}>
              Group Name :
            </Col>
            <Col sm={8}>
              <FormControl type="text" placeholder="Enter Group Name.." value={this.state.name} onChange={this.onChangeGroupName}/>
              <h5><small>* Group name should be unique for all plans</small></h5>
              { this.state.error.length > 0 ? <HelpBlock>{this.state.error}</HelpBlock> : ''}
            </Col>
          </FormGroup>
        );
      case 1:
        return (
          <FormGroup validationState={this.state.error.length > 0 ? "error" : ''} >
            <Col componentClass={ControlLabel} sm={4}>
              Usage Type :
            </Col>
            <Col sm={8}>
              <UsagetypeSelect onChangeUsageType={this.onChangeUsageType} value={this.state.usage}/>
              { this.state.error.length > 0 ? <HelpBlock>{this.state.error}</HelpBlock> : ''}
            </Col>
          </FormGroup>
        );
      case 2:
        return (
          <FormGroup validationState={this.state.error.length > 0 ? "error" : ''} >
            <Col componentClass={ControlLabel} sm={4}>
              Includes :
            </Col>
            <Col sm={8}>
              <Include onChangeInclud={this.onChangeInclud} value={this.state.include} />
              { this.state.error.length > 0 ? <HelpBlock>{this.state.error}</HelpBlock> : ''}
            </Col>
          </FormGroup>
        );
      case 3:
      return (
          <FormGroup validationState={this.state.error.length > 0 ? "error" : ''}>
            <Col componentClass={ControlLabel} sm={4}>
              Products :
            </Col>
            <Col sm={8}>
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
            </Col>
          </FormGroup>);
      default:
        return '...';
    }
  }

  renderTitle(){
    return "Create New Group";
  }

  renderTitleRight(){
    const { open } = this.state;
    if( !open ) { return null; }
    return (
      <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">Cancel</Tooltip>}>
        <FontIcon
          onClick={ this.handleCancel }
          className="material-icons"
          style={{ cursor: "pointer", color: Colors.grey500, fontSize: '18px' }}
        >close</FontIcon>
      </OverlayTrigger>
    );
  }

  renderControllers(){
    //create_new_folder//add_circle_outline
    return (
      <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">Create new gruop</Tooltip>}>
        <FontIcon
          onClick={ this.handleToggleBoby }
          className="material-icons"
          style={{cursor: "pointer", color: Colors.green300, fontSize: '32px', marginRight: '10px'}}
        >add_circle_outline</FontIcon>
      </OverlayTrigger>
    );
  }

  renderContent(){
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

        <div style={{marginTop: 50}}>
          <Form horizontal>
            {this.getStepContent(stepIndex)}
          </Form>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 50}}>
          <div>
            <FlatButton
              label="Reset"
              secondary={true}
              onTouchTap={this.handleReset}
              style={{marginRight: 24}}
            />
          </div>
          <div> </div>
          <div>
            <FlatButton
              label="Back"
              disabled={stepIndex === 0}
              onTouchTap={this.handlePrev}
              style={{marginRight: 12}}
            />
          { (stepIndex !== 3) ?
              <FlatButton
                label='Next'
                primary={true}
                disabled={stepIndex === 3}
                onTouchTap={this.handleNext}
              />
             :
             <FlatButton
               label='Add Group'
               primary={true}
               disabled={stepIndex !== 3}
               onTouchTap={this.handleFinish}
             />
           }
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { stepIndex, open } = this.state;
    return (
      <div style={{display: 'flex', /*borderTop: '1px solid #eee', paddingBottom: 10, /*backgroundColor: open ? 'rgba(0,0,0,0.03)' : 'transparent'*/}}>
        <div style={{flex: '2 0 0', margin: '6px 40px auto', textAlign: 'left'}}>
            {this.renderControllers()}
        </div>
        <div style={{flex: '9 0 0'}}>
          <div className="product" style={{marginTop: 20}}>
            <div style={{display: 'flex', marginBottom: open ? 20 : 0}}>
              <div style={{flex: '5 0 0', textAlign: 'left', cursor: "pointer"}} onClick={ this.handleToggleBoby }>
                <h4 style={{marginTop: 0}}><small>{this.renderTitle()}</small></h4>
              </div>
              <div style={{flex: '2 0 0', textAlign: 'right', pading: '0 3px', cursor: "pointer"}} onClick={ this.handleToggleBoby }>
               {this.renderTitleRight()}
              </div>
            </div>
            <Collapse in={open}>
              <div style={{backgroundColor: "rgba(0, 0, 0, 0.027451)", padding: 20, borderRadius: 5}}>
                {this.renderContent()}
              </div>
            </Collapse>
          </div>
        </div>
        <div style={{flex: '1 0 0'}}></div>
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

// import Select from 'react-select';
//
// getAvailableGroups(){
//   const { existingGroups } = this.props;
//   return existingGroups.map( (name) => {
//     return ({ value: name, label: name });
//   });
// }
//
// let options = this.getAvailableGroups();
//
// <Select
//   placeholder={'Select existing group or type new name...'}
//   addLabelText={'Add new {label} group ?'}
//   allowCreate={true}
//   value={this.state.name}
//   options={options}
//   onChange={this.onChangeGroupName}
// />
//
// onChangeGroupName(newName){
//   if(newName.length > 0){
//     const name = newName.toUpperCase();
//     const error = (!globalSetting.keyUppercaseRegex.test(name)) ? this.errors.name.allowedCharacters : '';
//     this.setState({name, error});
//   } else {
//     this.setState({name:'', error:''});
//   }
// }
// <h5><small>* Adding/removing products will affect all plans that contain &quot;{name}&quot; group</small></h5>
