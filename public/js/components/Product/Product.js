import React, { Component } from 'react';
import Immutable from 'immutable';
import moment from 'moment';
import { Form, FormGroup, ControlLabel, FormControl, Col, Row, Panel, Checkbox, Button } from 'react-bootstrap';

import Field from '../Field';
import Chips from '../Chips';
import Select from 'react-select';
import ProductPrice from './components/ProductPrice';


export default class Product extends Component {

  static propTypes = {
    product: React.PropTypes.object.isRequired,
    usaget: React.PropTypes.string.isRequired,
    product: React.PropTypes.object.isRequired,
    usageTypes: React.PropTypes.object.isRequired,
    onFieldUpdate: React.PropTypes.func.isRequired,
    onUsagetUpdate: React.PropTypes.func.isRequired,
    onProductRateAdd: React.PropTypes.func.isRequired,
    onProductRateRemove: React.PropTypes.func.isRequired,
  }

  componentDidMount(){
    const { product, planName, usaget } = this.props;
    const productPath = ['rates', usaget, planName, 'rate'];
    const prices      = product.getIn(productPath, Immutable.List());

    if(prices.size == 0){
      this.props.onProductRateAdd(productPath);
    }
  }

  onChangeName = (e) => {
    const { value } = e.target;
    this.props.onFieldUpdate(['key'], value);
  }

  onChangeCode = (e) => {
    const { value } = e.target;
    this.props.onFieldUpdate(['code'], value);
  }

  onChangeDescription = (e) => {
    const { value } = e.target;
    this.props.onFieldUpdate(['description'], value);
  }

  onChangeUsaget = (value) => {
    const { usaget } = this.props;
    this.props.onUsagetUpdate(['rates'], usaget, value);
  }

  onChangeVatable = (e) => {
    const { checked } = e.target;
    this.props.onFieldUpdate(['vatable'], checked);
  }

  onChangePrefix = (prefixes) => {
    this.props.onFieldUpdate(['params', 'prefix'], Immutable.List(prefixes));
  }

  onProductRateUpdate = (index, fieldName, value) => {
    const { product, planName, usaget } = this.props;
    const fieldPath   = ['rates', usaget, planName, 'rate', index, fieldName];
    this.props.onFieldUpdate(fieldPath, value);
  }
  onProductRateAdd = () => {
    const { product, planName, usaget } = this.props;
    const productPath = ['rates', usaget, planName, 'rate'];
    this.props.onProductRateAdd(productPath);
  }
  onProductRateRemove = (index) => {
    const { product, planName, usaget } = this.props;
    const productPath = ['rates', usaget, planName, 'rate'];
    this.props.onProductRateRemove(productPath, index);
  }

  getUsageTypesOptions = () => {
    const { usageTypes } = this.props;
    return usageTypes.map((usaget, key) => {
      return {value: usaget, label: usaget};
    }).toJS();
  }

  renderPrices = () => {
    const { product, planName, usaget } = this.props;
    const productPath = ['rates', usaget, planName, 'rate'];
    const prices      = product.getIn(productPath, Immutable.List());

    return prices.map( (price, i) =>
      <ProductPrice key={i} item={price} index={i} count={prices.size}
        onProductEditRate={this.onProductRateUpdate}
        onProductAddRate={this.onProductRateAdd}
        onProductRemoveRate={this.onProductRateRemove}
      />
    )

  }

  render() {
    const { product, planName, usageTypes, usaget, mode } = this.props;
    const productPath = ['rates', usaget, planName, 'rate'];
    const priceCount  = (product.getIn(productPath)) ? product.getIn(productPath, Immutable.List()).size : 0;
    const vatable     = product.get('vatable') ? true : false;
    const prefixs     = product.getIn(['params', 'prefix'], Immutable.List()).toArray();

    return (
      <Row>
        <Col lg={8}>
          <Form>
            <Panel>
              <Col lg={6} md={6}>
                <FormGroup>
                  <ControlLabel>Name</ControlLabel>
                  <Field onChange={ this.onChangeName } value={ product.get('key', '') } disabled={mode === 'update'} />
                </FormGroup>
              </Col>

              <Col lg={6} md={6}>
                <FormGroup>
                  <ControlLabel>Code</ControlLabel>
                  <Field onChange={ this.onChangeCode } value={ product.get('code', '') } />
                </FormGroup>
              </Col>

              <Col lg={12} md={12}>
                <FormGroup>
                  <ControlLabel>Description</ControlLabel>
                  <Field onChange={ this.onChangeDescription } value={ product.get('description', '') } fieldType="textarea" />
                </FormGroup>
              </Col>


              <Col lg={12} md={12}>
                <FormGroup>
                  <ControlLabel>Unit Type</ControlLabel>
                  <Select
                    disabled={mode === 'update'}
                    options={ this.getUsageTypesOptions() }
                    allowCreate={ true }
                    value={ usaget }
                    onChange={ this.onChangeUsaget }
                  />
                </FormGroup>
              </Col>

              <Col lg={12} md={12}>
                <FormGroup>
                  <Checkbox checked={ vatable } onChange={ this.onChangeVatable }>
                    VATable
                  </Checkbox>
                </FormGroup>
              </Col>

              <Col lg={12} md={12}>
                <FormGroup>
                  <ControlLabel>Prefixes</ControlLabel>
                  <Chips placeholder="Add new prefix" items={ prefixs } onChange={ this.onChangePrefix } />
                </FormGroup>
              </Col>

            </Panel>

            <Panel header={<h3>Price</h3>}>
             { this.renderPrices() }
            </Panel>

          </Form>
        </Col>
      </Row>
    );
  }

}
