import React, { Component }  from 'react';
import Immutable from 'immutable';
import { Modal, Form, FormGroup, FormControl, ControlLabel, HelpBlock, Button, Checkbox,
   Col, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import { GroupsInclude } from '../../../FieldDescriptions';
import Help from '../../Help';
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
    name: '', usage: '', include: '', products: Immutable.List(), shared: false,
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

  onChangeShared = (e) => {
    const { checked:shared } = e.target;
    this.setState({ shared });
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
    const { stepIndex, name, usage, include, products, shared } = this.state;

    if(this.validateStep(stepIndex)){
      this.props.addGroup(name, usage, include, shared);
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
    const { name, products, include, usage, shared, error } = this.state;
    const existingProductsKeys = allGroupsProductsKeys.union(products);

    switch (stepIndex) {

      case 0:
        return (
          <FormGroup validationState={error.length > 0 ? "error" : null}>
            <Col componentClass={ControlLabel} sm={3}>Name<Help contents={GroupsInclude.name} /></Col>
            <Col sm={8}>
              <FormControl type="text" placeholder="Enter Group Name.." value={name} onChange={this.onChangeGroupName}/>
              { error.length > 0 && <HelpBlock>{error}</HelpBlock>}
            </Col>
          </FormGroup>
        );

      case 1:
        return (
          <FormGroup validationState={error.length > 0 ? "error" : null} >
            <Col componentClass={ControlLabel} sm={3}>Unit Type</Col>
            <Col sm={8}>
              <UsagetypeSelect onChangeUsageType={this.onChangeUsageType} value={usage}/>
              { error.length > 0 && <HelpBlock>{error}</HelpBlock>}
            </Col>
          </FormGroup>
        );

      case 2:
        return ([
          <FormGroup validationState={error.length > 0 ? "error" : null} >
            <Col componentClass={ControlLabel} sm={3}>Include</Col>
            <Col sm={8}>
              <Field onChange={this.onChangeInclud} value={include} fieldType="unlimited" unlimitedValue="UNLIMITED"/>
              { error.length > 0 && <HelpBlock>{error}</HelpBlock> }
            </Col>
          </FormGroup>,
          <FormGroup>
            <Col smOffset={3} sm={8}>
              <Checkbox checked={shared} onChange={this.onChangeShared}>Share with all account's subscribers<Help contents={GroupsInclude.shared_desc} /></Checkbox>
            </Col>
          </FormGroup>
        ]);

      case 3:
        return (
          <FormGroup validationState={error.length > 0 ? "error" : null}>
            <Col componentClass={ControlLabel} sm={3}>Products</Col>
            <Col sm={8}>
              { products.size
               ? <Products onRemoveProduct={this.onRemoveProduct} products={products} />
               : <p style={{marginTop:8}}>No products in group ...</p>
              }
              <div style={{ marginTop: 10, minWidth: 250, width: '100%', height: 42 }}>
                <ProductSearchByUsagetype usaget={usage} products={existingProductsKeys.toList()} addRatesToGroup={this.onAddProduct} />
              </div>
              { error.length > 0 && <HelpBlock>{error}</HelpBlock>}
            </Col>
          </FormGroup>);

      default:
        return '...';
    }
  }

  render() {
    const { stepIndex, open } = this.state;

    return (
      <div>
        <Button bsSize="xsmall" className="btn-primary" onClick={this.handleToggleBoby}><i className="fa fa-plus" />&nbsp;Create New Group</Button>
        <Modal show={open} keyboard={false}>

          <Modal.Header closeButton onHide={this.handleCancel}>
            <Modal.Title>
              Create New Group
              <Stepper activeStep={stepIndex} style={{ height: 20, marginLeft: -15, marginTop: 15 }}>
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
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div style={{marginTop: 25, marginBottom: 25}}>
              <Form horizontal>
                {this.getStepContent(stepIndex)}
              </Form>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button bsSize="small" onClick={this.handlePrev} style={{marginRight: 9, minWidth: 90}}><i className="fa fa-angle-left" />&nbsp;Back</Button>
            { (stepIndex === 3)
              ? <Button bsSize="small" onClick={this.handleFinish} style={{ minWidth: 90 }} bsStyle="primary">Save</Button>
              : <Button bsSize="small" onClick={this.handleNext} style={{ minWidth: 90 }}><i className="fa fa-angle-right" />&nbsp;Next</Button>
            }
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
