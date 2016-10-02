import React, { Component } from 'react';
import { FormGroup, Col, Row, ControlLabel, HelpBlock, OverlayTrigger, Tooltip } from 'react-bootstrap';
import moment from 'moment';
import Immutable from 'immutable';
import Field from '../../Field';

export default class ProductPrice extends Component {

  static propTypes = {
    index: React.PropTypes.number.isRequired,
    count: React.PropTypes.number.isRequired,
    item: React.PropTypes.object.isRequired,
    onProductEditRate: React.PropTypes.func.isRequired,
    onProductRemoveRate: React.PropTypes.func.isRequired,
    onProductAddRate: React.PropTypes.func.isRequired,
  }

  planCycleUnlimitedValue = globalSetting.productUnlimitedValue;

  state = { fromError: '', toError: '', intervalError: '', priceError: '' }

  // shouldComponentUpdate(nextProps, nextState){
  //   //if count was changed and this is last item
  //   const isLastAdded = this.props.count < nextProps.count && this.props.index === (this.props.count - 1);
  //   const isLastremoved = this.props.count > nextProps.count && this.props.index === (this.props.count - 2);
  //   const fromError = nextState.fromError !== this.state.fromError;
  //   const toError = nextState.toError !== this.state.toError;
  //   const intervalError = nextState.intervalError !== this.state.intervalError;
  //   const priceError = nextState.priceError !== this.state.priceError;
  //   const itemChanged = !Immutable.is(this.props.item, nextProps.item);
  //   const indexChanged = this.props.index !== nextProps.index
  //   return  isLastAdded || isLastremoved || fromError || toError || intervalError || priceError || itemChanged || indexChanged;
  // }

  tooltip = (content) => {
    return (<Tooltip id="tooltip">{content}</Tooltip>);
  }

  onEditFrom = (e) => {
    const { index } = this.props;
    let value = parseInt(e.target.value);
    if(Number.isInteger(value)){
      this.props.onProductEditRate(index, "from", value);
      this.setState({ fromError: '' })
    } else {
      this.setState({ fromError: 'Must be of type integer' })
    }
  }

  onEditTo = (e) => {
    const { index } = this.props;
    let value = parseInt(e.target.value);
    if(Number.isInteger(value)){
      this.props.onProductEditRate(index, "to", value);
      this.setState({ toError: '' })
    } else {
      this.setState({ toError: 'Must be of type integer' })
    }
  }
  onEditUnlimitedTo = (unlimited) => {
    const { index } = this.props;
    this.setState({ toError: '' })
    this.props.onProductEditRate(index, "to", unlimited);
  }

  onEditInterval = (e) => {
    const { index } = this.props;
    let value = parseInt(e.target.value);
    if(Number.isInteger(value)){
      this.props.onProductEditRate(index, "interval", value);
      this.setState({ intervalError: '' })
    } else {
      this.setState({ intervalError: 'Must be of type integer' })
    }
  }

  onEditPrice = (e) => {
    const { index } = this.props;
    const { value } = e.target;
    this.props.onProductEditRate(index, "price", value);
  }

  onRemoveItem = () => {
    const { index } = this.props;
    this.props.onProductRemoveRate(index);
  }

  onAddItem = () => {
    this.props.onProductAddRate();
  }

  render() {
    const { item, index, count } = this.props;
    const isLast = ((count === 0) || (count-1 === index));

    return (
      <Row>

        <Col lg={5} md={5} sm={6} xs={12}>
          <FormGroup validationState={this.state.fromError.length > 0 ? "error" : ''}>
            <ControlLabel>From</ControlLabel>
            <Field value={item.get('from', '')} onChange={this.onEditFrom} fieldType="number" min={0}/>
            { this.state.fromError.length > 0 ? <HelpBlock>{this.state.fromError}</HelpBlock> : ''}
          </FormGroup>
        </Col>

        <Col lg={5} md={5} sm={6} xs={12}>
          <FormGroup validationState={this.state.toError.length > 0 ? "error" : ''}>
            <ControlLabel>To</ControlLabel>
            {isLast
              ? <Field value={item.get('to', '')} onChange={this.onEditUnlimitedTo} fieldType="unlimited" unlimitedValue={this.planCycleUnlimitedValue}/>
              : <Field value={item.get('to', '')} onChange={this.onEditTo} fieldType="number" min={0}/>
            }
            { this.state.toError.length > 0 ? <HelpBlock>{this.state.toError}</HelpBlock> : ''}
          </FormGroup>
        </Col>
        <Col lg={2} md={2} smHidden xsHidden></Col>

        <Col lg={5} md={5} sm={6} xs={12}>
          <FormGroup  validationState={this.state.intervalError.length > 0 ? "error" : ''}>
            <ControlLabel>Interval</ControlLabel>
            <Field value={item.get('interval', '')} onChange={this.onEditInterval} fieldType="number" min={0}/>
            { this.state.intervalError.length > 0 ? <HelpBlock>{this.state.intervalError}</HelpBlock> : ''}
          </FormGroup>
        </Col>

        <Col lg={5} md={5} sm={6} xs={12}>
          <FormGroup>
            <ControlLabel>Price</ControlLabel>
            <Field value={item.get('price', '')} onChange={this.onEditPrice} fieldType="price" />
          </FormGroup>
        </Col>

        <Col lg={1} md={1} sm={1} xs={2} lgOffset={0} mdOffset={0} smOffset={10} xsOffset={8} className="text-right">
          { (isLast) &&
            <OverlayTrigger placement="top" overlay={this.tooltip("Add interval")}>
              <i className="fa fa-plus-circle fa-lg" onClick={this.onAddItem} style={{cursor: "pointer", color: 'green', marginTop: 35}} ></i>
            </OverlayTrigger>
          }
        </Col>

        <Col lg={1} md={1} sm={1} xs={2} className="text-right">
          { (index > 0 && isLast) &&
            <OverlayTrigger placement="top" overlay={this.tooltip("Remove interval")}>
              <i className="fa fa-minus-circle fa-lg"  onClick={this.onRemoveItem} style={{cursor: "pointer", color: 'red', marginTop: 35}} ></i>
            </OverlayTrigger>
          }
        </Col>

        { !isLast && <Col lg={12} md={12} sm={12} xs={12}><hr /></Col> }
      </Row>
    );
  }
}