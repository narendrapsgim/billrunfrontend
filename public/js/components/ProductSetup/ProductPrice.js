import React, { Component } from 'react';
import { FormGroup, Col, Row, ControlLabel, HelpBlock, OverlayTrigger, Tooltip } from 'react-bootstrap';
import moment from 'moment';
import Immutable from 'immutable';
import Field from '../Field';

export default class ProductPrice extends Component {

  // state = { fromError: '', toError: '', intervalError: '', priceError: '' }

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
    const { value } = e.target;
    this.props.onProductEditRate(index, "from", value);
  }

  onEditTo = (e) => {
    const { index } = this.props;
    const { value } = e.target;
    this.props.onProductEditRate(index, "to", value);
  }

  onEditInterval = (e) => {
    const { index } = this.props;
    const { value } = e.target;
    this.props.onProductEditRate(index, "interval", value);
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

        <Col lg={2} md={2} sm={6} xs={12}>
          <FormGroup>
            <ControlLabel>From</ControlLabel>
            <Field value={item.get('from', '')} onChange={this.onEditFrom} fieldType="number" min={0}/>
          </FormGroup>
        </Col>

        <Col lg={2} md={2} sm={6} xs={12}>
          <FormGroup>
            <ControlLabel>To</ControlLabel>
            <Field value={item.get('to', '')} onChange={this.onEditTo} fieldType="number" min={0}/>
          </FormGroup>
        </Col>

        <Col lg={2} md={2} sm={6} xs={12}>
          <FormGroup>
            <ControlLabel>Interval</ControlLabel>
            <Field value={item.get('interval', '')} onChange={this.onEditInterval} fieldType="number" min={0}/>
          </FormGroup>
        </Col>

        <Col lg={4} md={4} sm={6} xs={12}>
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

        { !isLast && <Col lgHidden mdHidden sm={12} xs={12}><hr /></Col> }
      </Row>
    );
  }
}
