import React, { Component }  from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, FormControl, ControlLabel, HelpBlock, Button,
   Col, Row, Collapse, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import UsagetypeSelect from './UsagetypeSelect';
import Field from '../../Field';
import Products from './Products';
import ProductSearchByUsagetype from './ProductSearchByUsagetype';


export default class PlanIncludeGroupCreate extends Component {

  static propTypes = {
    allGroupsProductsKeys: React.PropTypes.instanceOf(Immutable.Set),
    existinGrousNames: React.PropTypes.instanceOf(Immutable.Set),
    addGroup: React.PropTypes.func.isRequired,
    addGroupProducts: React.PropTypes.func.isRequired,
  }

  static defaultProps = {
    allGroupsProductsKeys: Immutable.Set(),
    existinGrousNames: Immutable.Set(),
  };

  defaultState = {
    name: '', usage: '', include: '', products: Immutable.List(),
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
      required: 'Products is required',
      exist: 'Product(s) already exist in another group : '
    }
  }

  state = Object.assign({}, this.defaultState);

  validateStep = (step) => {
    switch (step) {
      case 0:
        const { existinGrousNames } = this.props;

        if( this.state.name === '' ){
          this.setState({ error: this.errors.name.required });
          return false;
        }
        if( existinGrousNames.includes(this.state.name)){
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
        const { allGroupsProductsKeys } = this.props;

        if( this.state.products.size < 1 ){
          this.setState({ error: this.errors.products.required });
          return false;
        }
        const duplicateProducts = this.state.products.filter( (product) => allGroupsProductsKeys.includes(product));
        if( duplicateProducts.size ){
          this.setState({ error: this.errors.products.exist + duplicateProducts.join(', ') });
          return false;
        }
        return true;
      default: return true;

    }
  }

  onChangeGroupName = (e) => {
    const name = e.target.value.toUpperCase();
    const error = (name.length && !globalSetting.keyUppercaseRegex.test(name)) ? this.errors.name.allowedCharacters : '';
    this.setState({name, error});
  }

  onChangeUsageType = (newValue) => {
    this.setState({usage: newValue, products: Immutable.List(), error:''});
  }

  onChangeInclud = (newValue) => {
    const error =  (!( /^[+-]?\d+(\.\d+)?$/.test( newValue )) && newValue !== 'UNLIMITED' ) ? this.errors.include.allowedCharacters : '' ;
    this.setState({include: newValue, error});
  }

  onAddProduct = (key) => {
    const products = this.state.products.push(key);
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
    this.setState(Object.assign({}, this.defaultState, {open}));
  }

  handleCancel = () => {
    this.resetState(false);
  }

  handleFinish = () => {
    const { stepIndex, name, usage, include, products } = this.state;

    if(this.validateStep(stepIndex)){
      this.props.addGroup(name, usage, include);
      this.props.addGroupProducts(name, usage, products.toArray());
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
    const { allGroupsProductsKeys } = this.props;
    const { name, products, include, usage, error } = this.state;
    const existingProductsKeys = allGroupsProductsKeys.union(products);

    switch (stepIndex) {
      case 0:
        return (
          <FormGroup validationState={error.length > 0 ? "error" : null}>
            <ControlLabel>Group Name</ControlLabel>
              <FormControl type="text" placeholder="Enter Group Name.." value={name} onChange={this.onChangeGroupName}/>
              <h5><small>* Group name should be unique for all plans</small></h5>
              { error.length > 0 && <HelpBlock>{error}</HelpBlock>}
          </FormGroup>
        );
      case 1:
        return (
          <FormGroup validationState={error.length > 0 ? "error" : null} >
            <ControlLabel>Usage Type</ControlLabel>
            <UsagetypeSelect onChangeUsageType={this.onChangeUsageType} value={usage}/>
            { error.length > 0 && <HelpBlock>{error}</HelpBlock>}
          </FormGroup>
        );
      case 2:
        return (
          <FormGroup validationState={error.length > 0 ? "error" : null} >
            <ControlLabel>Includes</ControlLabel>
            <Field onChange={this.onChangeInclud} value={include} fieldType="unlimited" unlimitedValue="UNLIMITED"/>
            { error.length > 0 && <HelpBlock>{error}</HelpBlock> }
          </FormGroup>
        );
      case 3:

        return (
          <FormGroup validationState={error.length > 0 ? "error" : null}>
            <ControlLabel>Products</ControlLabel>
              { products.size
               ? <Products onRemoveProduct={this.onRemoveProduct} products={products} />
               : <p style={{marginTop:8}}>No products in group ...</p>
              }
              <div style={{ marginTop: 10, minWidth: 250, width: '100%', height: 42 }}>
                <ProductSearchByUsagetype usaget={usage} products={existingProductsKeys.toList()} addRatesToGroup={this.onAddProduct} />
              </div>
              { error.length > 0 && <HelpBlock>{error}</HelpBlock>}
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
        <i className="fa fa-times" onClick={this.handleCancel} style={{cursor: "pointer"}} />
      </OverlayTrigger>
    );
  }

  renderTitleLeft = () => {
    return (
      <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">Create new gruop</Tooltip>}>
        <i className="fa fa-plus-circle fa-lg" onClick={this.handleToggleBoby} style={{cursor: "pointer", color: 'green'}} />
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
            <Button bsStyle="danger" onClick={this.handleReset}>Reset</Button>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6} lgOffset={3} mdOffset={3} smOffset={3} xsOffset={3} className="text-right">
            <Button onClick={this.handlePrev} style={{marginRight:10}}>Back</Button>
            { (stepIndex === 3)
              ? <Button bsStyle="success" onClick={this.handleFinish}>Add Group</Button>
              : <Button bsStyle="success" onClick={this.handleNext}>Next</Button>
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
