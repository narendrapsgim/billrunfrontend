import React, { Component } from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import { Form, FormGroup, ControlLabel, Col, Row, Panel, Checkbox, Button, HelpBlock } from 'react-bootstrap';
import Help from '../Help';
import Field from '../Field';
import { ProductDescription } from '../../FieldDescriptions';
import ProductPrice from './components/ProductPrice';
import ProductParam from './components/ProductParam';
import ProductParamEdit from './components/ProductParamEdit';


export default class Product extends Component {

  static propTypes = {
    errorMessages: React.PropTypes.object,
    mode: React.PropTypes.string.isRequired,
    onFieldUpdate: React.PropTypes.func.isRequired,
    onProductRateAdd: React.PropTypes.func.isRequired,
    onProductRateRemove: React.PropTypes.func.isRequired,
    onToUpdate: React.PropTypes.func.isRequired,
    onUsagetUpdate: React.PropTypes.func.isRequired,
    planName: React.PropTypes.string.isRequired,
    product: React.PropTypes.object.isRequired,
    usaget: React.PropTypes.string.isRequired,
    usageTypes: React.PropTypes.object.isRequired,
  }

  static defaultProps = {
    errorMessages: {
      name: {
        allowedCharacters: 'Key contains illegal characters, key should contain only alphabets, numbers and underscore(A-Z, 0-9, _)',
      },
    },
  };

  state = {
    errors: {
      name: '',
    },
    newProductParam: false,
  }

  componentDidMount() {
    const { product, planName, usaget } = this.props;
    const productPath = ['rates', usaget, planName, 'rate'];
    const prices = product.getIn(productPath, Immutable.List());

    if (prices.size === 0) {
      this.props.onProductRateAdd(productPath);
    }
  }

  onChangeName = (e) => {
    const { errorMessages: { name: { allowedCharacters } } } = this.props;
    const { errors } = this.state;
    const value = e.target.value.toUpperCase();
    const newError = (!globalSetting.keyUppercaseRegex.test(value)) ? allowedCharacters : '';
    this.setState({ errors: Object.assign({}, errors, { name: newError }) });
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
    const prefixesList = (prefixes.length) ? prefixes.split(',') : [];
    this.props.onFieldUpdate(['params', 'prefix'], Immutable.List(prefixesList));
  }

  onChangeParamKey = (oldKey, newKey) => {
    const { product } = this.props;
    const paramValues = product.getIn(['params', oldKey], Immutable.List());
    const updatedParams = product.get('params', Immutable.Map()).delete(oldKey).set(newKey, paramValues);
    this.props.onFieldUpdate(['params'], updatedParams);
  }

  onChangeParamValues = (key, values) => {
    const paramPath = ['params', key];
    this.props.onFieldUpdate(paramPath, Immutable.fromJS(values));
  }

  onRemoveParam = (paramKey) => {
    const { product } = this.props;
    const updatedParams = product.get('params', Immutable.Map()).delete(paramKey);
    this.props.onFieldUpdate(['params'], updatedParams);
  }

  onProductParamSave = (key, oldKey, values, newParam) => {
    if (!newParam && oldKey !== key) {
      this.onChangeParamKey(oldKey, key);
    }
    this.onChangeParamValues(key, values);
  }

  onProductParamAdd = () => {
    this.setState({ newProductParam: true });
  }

  onParamEditClose = () => {
    this.setState({ newProductParam: false });
  }

  getExistingParamKeys = () => {
    const { product } = this.props;
    const params = product.get('params', Immutable.Map());
    return params.keySeq().toList();
  }

  renderNewProductParam = () => {
    const { newProductParam } = this.state;

    return newProductParam ?
    (<ProductParamEdit
      newParam={true}
      onParamSave={this.onProductParamSave}
      onParamEditClose={this.onParamEditClose}
      paramKey={''}
      paramValues={[]}
      existingKeys={this.getExistingParamKeys()}
    />)
    : null;
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
    const { planName, usaget } = this.props;
    const productPath = ['rates', usaget, planName, 'rate'];
    this.props.onProductRateAdd(productPath);
  }
  onProductRateRemove = (index) => {
    const { planName, usaget } = this.props;
    const productPath = ['rates', usaget, planName, 'rate'];
    this.props.onProductRateRemove(productPath, index);
  }

  getUsageTypesOptions = () => {
    const { usageTypes } = this.props;
    return usageTypes.map(usaget => ({ value: usaget, label: usaget })).toJS();
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

  renderParameters = () => {
    const { product } = this.props;
    const params = product.get('params', Immutable.Map());
    const mainParams = Immutable.List(['prefix']);
    let index = 0;

    return params
      .filter((paramValues, paramKey) => !mainParams.includes(paramKey))
      .map((paramValues, paramKey) =>
        <ProductParam
          key={index++}
          paramKey={paramKey}
          paramValues={paramValues.toJS()}
          existingKeys={this.getExistingParamKeys()}
          onProductParamSave={this.onProductParamSave}
          onRemoveParam={this.onRemoveParam}
        />
    ).toList();
  }

  render() {
    const { errors } = this.state;
    const { product, usaget, mode } = this.props;
    const vatable = (product.get('vatable', false) === true);
    const prefixs = product.getIn(['params', 'prefix'], Immutable.List()).join(',');
    const availablePrefix = [];

    return (
      <Row>
        <Col lg={12}>
          <Form horizontal>
            <Panel>

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  Title<Help contents={ProductDescription.description} />
                </Col>
                <Col sm={8} lg={9}>
                  <Field onChange={this.onChangeDescription} value={product.get('description', '')} />
                </Col>
              </FormGroup>

              {mode === 'new' &&
                <FormGroup validationState={errors.name.length > 0 ? 'error' : null} >
                  <Col componentClass={ControlLabel} sm={3} lg={2}>
                    Key<Help contents={ProductDescription.key} />
                  </Col>
                  <Col sm={8} lg={9}>
                    <Field onChange={this.onChangeName} value={product.get('key', '')} disabled={mode === 'update'} />
                    { errors.name.length > 0 && <HelpBlock>{errors.name}</HelpBlock> }
                  </Col>
                </FormGroup>
              }

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>External Code</Col>
                <Col sm={8} lg={9}>
                  <Field onChange={this.onChangeCode} value={product.get('code', '')} />
                </Col>
              </FormGroup>

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>Prefixes</Col>
                <Col sm={8} lg={9}>
                  <Select
                    allowCreate
                    multi={true}
                    value={prefixs}
                    options={availablePrefix}
                    onChange={this.onChangePrefix}
                    placeholder="Add Prefix..."
                  />
                </Col>
              </FormGroup>

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>Unit Type</Col>
                <Col sm={4}>
                  <Select
                    allowCreate
                    disabled={mode === 'update'}
                    onChange={this.onChangeUsaget}
                    options={this.getUsageTypesOptions()}
                    value={usaget}
                  />
                </Col>
              </FormGroup>

            </Panel>

            <Panel header={<h3>Pricing</h3>}>
              <Col lg={12} md={12}>
                <FormGroup>
                  <Checkbox checked={vatable} onChange={this.onChangeVatable}>
                      This product is VAT rated
                    </Checkbox>
                </FormGroup>
              </Col>
              { this.renderPrices() }
              <br />
              <Button bsSize="xsmall" className="btn-primary" onClick={this.onProductRateAdd}><i className="fa fa-plus" />&nbsp;Add New</Button>
            </Panel>

            <Panel header={<h3>Additional Parameters</h3>}>
              { this.renderParameters() }
              <br />
              <Button bsSize="xsmall" className="btn-primary" onClick={this.onProductParamAdd}><i className="fa fa-plus" />&nbsp;Add New</Button>
            </Panel>

            {this.renderNewProductParam()}

          </Form>
        </Col>
      </Row>
    );
  }

}
