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
    planName: React.PropTypes.string.isRequired,
    mode: React.PropTypes.string.isRequired,
    product: React.PropTypes.object.isRequired,
    usaget: React.PropTypes.string.isRequired,
    usageTypes: React.PropTypes.object.isRequired,
    onFieldUpdate: React.PropTypes.func.isRequired,
    onToUpdate: React.PropTypes.func.isRequired,
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
    const { planName, usaget } = this.props;
    switch (fieldName) {
      case 'to': {
        const fieldPath = ['rates', usaget, planName, 'rate'];
        this.props.onToUpdate(fieldPath, index, value);
      }
        break;

      default: {
        const fieldPath = ['rates', usaget, planName, 'rate', index, fieldName];
        this.props.onFieldUpdate(fieldPath, value);
      }
    }
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
    const prices = product.getIn(productPath, Immutable.List());

    return prices.map((price, i) =>
      <ProductPrice
        count={prices.size}
        index={i}
        item={price}
        key={i}
        onProductEditRate={this.onProductRateUpdate}
        onProductRemoveRate={this.onProductRateRemove}
      />
    );
  }

  render() {
    const { product, planName, usageTypes, usaget, mode } = this.props;
    const productPath = ['rates', usaget, planName, 'rate'];
    const priceCount  = (product.getIn(productPath)) ? product.getIn(productPath, Immutable.List()).size : 0;
    const vatable     = product.get('vatable') ? true : false;
    const prefixs     = product.getIn(['params', 'prefix'], Immutable.List()).toArray();

    return (
      <Row>
        <Col lg={12}>
          <Form>
            <Panel>

              <Row>
                <Col lg={6} md={6}>
                  <FormGroup>
                    <ControlLabel>Name</ControlLabel>
                    <Field onChange={ this.onChangeName } value={ product.get('key', '') } disabled={mode === 'update'} />
                  </FormGroup>
                </Col>

                <Col lg={6} md={6}>
                  <FormGroup>
                    <ControlLabel>Code</ControlLabel>
                    <Field onChange={this.onChangeCode} value={ product.get('code', '') } />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col lg={12} md={12}>
                  <FormGroup>
                    <ControlLabel>Description</ControlLabel>
                    <Field onChange={this.onChangeDescription} value={product.get('description', '')} fieldType="textarea" />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col lg={12} md={12}>
                  <FormGroup>
                    <ControlLabel>Unit Type</ControlLabel>
                    <Select allowCreate
                        disabled={mode === 'update'}
                        onChange={this.onChangeUsaget}
                        options={this.getUsageTypesOptions()}
                        value={usaget}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col lg={12} md={12}>
                  <FormGroup>
                    <ControlLabel>Prefixes</ControlLabel>
                    <Chips onChange={this.onChangePrefix} items={prefixs} placeholder='Add new prefix' />
                  </FormGroup>
                </Col>
              </Row>

            </Panel>

            <Panel header={<h3>Pricing</h3>}>
              <Row>
                <Col lg={12} md={12}>
                  <FormGroup>
                    <Checkbox checked={vatable} onChange={this.onChangeVatable}>
                      This product is VAT rated
                    </Checkbox>
                  </FormGroup>
                </Col>
              </Row>
              { this.renderPrices() }
             <br />
            <Button bsSize="xsmall" className="btn-primary" onClick={this.onProductRateAdd}><i className="fa fa-plus" />&nbsp;Add New</Button>
            </Panel>

          </Form>
        </Col>
      </Row>
    );
  }

}
