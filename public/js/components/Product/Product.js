import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import { Form, FormGroup, ControlLabel, Col, Row, Panel, Checkbox, HelpBlock } from 'react-bootstrap';
import Help from '../Help';
import Field from '../Field';
import CreateButton from '../Elements/CreateButton';
import { ProductDescription } from '../../FieldDescriptions';
import ProductPrice from './components/ProductPrice';
import ProductParam from './components/ProductParam';
import ProductParamEdit from './components/ProductParamEdit';
import EntityFields from '../Entity/EntityFields';
import UsageTypesSelector from '../UsageTypes/UsageTypesSelector';


export default class Product extends Component {

  static propTypes = {
    product: PropTypes.instanceOf(Immutable.Map),
    mode: PropTypes.string.isRequired,
    usaget: PropTypes.string,
    planName: PropTypes.string,
    errorMessages: PropTypes.object,
    onFieldUpdate: PropTypes.func.isRequired,
    onProductRateAdd: PropTypes.func.isRequired,
    onProductRateRemove: PropTypes.func.isRequired,
    onToUpdate: PropTypes.func.isRequired,
    onUsagetUpdate: PropTypes.func.isRequired,
  }

  static defaultProps = {
    planName: 'BASE',
    product: Immutable.Map(),
    usaget: '',
    errorMessages: {
      name: {
        allowedCharacters: 'Key contains illegal characters, key should contain only alphabets, numbers and underscores (A-Z, 0-9, _)',
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

  onChangeUnit = (unit) => {
    const { product, planName, usaget } = this.props;
    const ratePath = ['rates', usaget, planName, 'rate'];
    const rates = product.getIn(ratePath, Immutable.List());
    rates.forEach((rate, index) => {
      const rangeUnitsPath = [...ratePath, index, 'uom_display', 'range'];
      const intervalUnitsPath = [...ratePath, index, 'uom_display', 'interval'];
      this.props.onFieldUpdate(rangeUnitsPath, unit);
      this.props.onFieldUpdate(intervalUnitsPath, unit);
    });
  }

  onChangeVatable = (e) => {
    const { checked } = e.target;
    this.props.onFieldUpdate(['vatable'], checked);
  }

  onChangePrefix = (prefixes) => {
    const prefixesList = (prefixes.length) ? prefixes.split(',') : [];
    this.props.onFieldUpdate(['params', 'prefix'], Immutable.Set(prefixesList));
  }

  onChangeParamKey = (oldKey, newKey) => {
    const { product } = this.props;
    const paramValues = product.getIn(['params', oldKey], Immutable.List());
    const updatedParams = product.get('params', Immutable.Map()).delete(oldKey).set(newKey, paramValues);
    this.props.onFieldUpdate(['params'], updatedParams);
  }

  onChangeParamValues = (key, values) => {
    const paramPath = ['params', key];
    this.props.onFieldUpdate(paramPath, Immutable.List(values));
  }

  onChangePricingMethod = (e) => {
    const { value } = e.target;
    this.props.onFieldUpdate(['pricing_method'], value);
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
    if (newProductParam) {
      return (
        <ProductParamEdit
          newParam={true}
          onParamSave={this.onProductParamSave}
          onParamEditClose={this.onParamEditClose}
          paramKey={''}
          paramValues={[]}
          existingKeys={this.getExistingParamKeys()}
        />
      );
    }
    return null;
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

  onChangeAdditionalField = (field, value) => {
    this.props.onFieldUpdate(field, value);
  }

  renderPrices = () => {
    const { product, planName, usaget, mode } = this.props;
    const productPath = ['rates', usaget, planName, 'rate'];
    const prices = product.getIn(productPath, Immutable.List());

    return prices.map((price, i) =>
      <ProductPrice
        mode={mode}
        count={prices.size}
        index={i}
        item={price}
        key={i}
        unit={this.getUnit()}
        onProductEditRate={this.onProductRateUpdate}
        onProductRemoveRate={this.onProductRateRemove}
      />
    );
  }

  renderParameters = () => {
    const { product, mode } = this.props;
    const params = product.get('params', Immutable.Map());
    const mainParams = Immutable.List(['prefix']);
    let index = 0;
    const editable = (mode !== 'view');

    return params
      .filter((paramValues, paramKey) => !mainParams.includes(paramKey))
      .map((paramValues, paramKey) =>
        <ProductParam
          key={index++}
          editable={editable}
          paramKey={paramKey}
          paramValues={paramValues.toJS()}
          existingKeys={this.getExistingParamKeys()}
          onProductParamSave={this.onProductParamSave}
          onRemoveParam={this.onRemoveParam}
        />
    ).toList();
  }

  getUnit = () => {
    const { product, usaget } = this.props;
    return product.getIn(['rates', usaget, 'BASE', 'rate', 0, 'uom_display', 'range'], '');
  }

  render() {
    const { errors } = this.state;
    const { product, usaget, mode } = this.props;
    const unit = this.getUnit();
    const vatable = (product.get('vatable', true) === true);
    const prefixs = product.getIn(['params', 'prefix'], Immutable.List()).join(',');
    const pricingMethod = product.get('pricing_method', '');
    const availablePrefix = [];
    const editable = (mode !== 'view');

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
                  <Field onChange={this.onChangeDescription} value={product.get('description', '')} editable={editable} />
                </Col>
              </FormGroup>

              { ['clone', 'create'].includes(mode) &&
                <FormGroup validationState={errors.name.length > 0 ? 'error' : null} >
                  <Col componentClass={ControlLabel} sm={3} lg={2}>
                    Key<Help contents={ProductDescription.key} />
                  </Col>
                  <Col sm={8} lg={9}>
                    <Field onChange={this.onChangeName} value={product.get('key', '')} disabled={!['clone', 'create'].includes(mode)} editable={editable} />
                    { errors.name.length > 0 && <HelpBlock>{errors.name}</HelpBlock> }
                  </Col>
                </FormGroup>
              }

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>External Code</Col>
                <Col sm={8} lg={9}>
                  <Field onChange={this.onChangeCode} value={product.get('code', '')} editable={editable} />
                </Col>
              </FormGroup>

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>Prefixes</Col>
                <Col sm={8} lg={9}>
                  { editable
                    ? (
                      <Select
                        allowCreate
                        multi={true}
                        value={prefixs}
                        options={availablePrefix}
                        onChange={this.onChangePrefix}
                        placeholder="Add Prefix..."
                      />
                    )
                    : <div className="non-editable-field">{ prefixs }</div>
                  }

                </Col>
              </FormGroup>

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>Unit Type</Col>
                <Col sm={4}>
                  { editable && ['clone', 'create'].includes(mode)
                    ? (
                      <UsageTypesSelector
                        usaget={usaget}
                        unit={unit}
                        onChangeUsaget={this.onChangeUsaget}
                        onChangeUnit={this.onChangeUnit}
                      />
                    )
                    : <div className="non-editable-field">{ `${usaget} (${unit})` }</div>
                  }
                </Col>
              </FormGroup>

              <EntityFields
                entityName="rates"
                entity={product}
                onChangeField={this.onChangeAdditionalField}
                editable={editable}
              />

            </Panel>

            <Panel header={<h3>Pricing</h3>}>
              <FormGroup>
                <Col sm={12}>
                  { editable
                    ? [(
                      <Col sm={3} key="pricing-method-1">
                        <div className="inline">
                          <Field
                            fieldType="radio"
                            name="pricing-method"
                            id="pricing-method-tiered"
                            value="tiered"
                            checked={pricingMethod === 'tiered'}
                            onChange={this.onChangePricingMethod}
                            label="Tiered pricing"
                          />
                        </div>
                        &nbsp;<Help contents={ProductDescription.tieredPricing} />
                      </Col>
                    ),
                    (
                      <Col sm={3} key="pricing-method-2">
                        <div className="inline">
                          <Field
                            fieldType="radio"
                            name="pricing-method"
                            id="pricing-method-volume"
                            value="volume"
                            checked={pricingMethod === 'volume'}
                            onChange={this.onChangePricingMethod}
                            label="Volume pricing"
                          />
                        </div>
                        &nbsp;<Help contents={ProductDescription.volumePricing} />
                      </Col>
                    )]
                    : (
                      <div className="non-editble-field">
                        { pricingMethod === 'tiered'
                          ? 'Tiered pricing'
                          : 'Volume pricing'
                        }
                      </div>
                    )
                  }
                </Col>
              </FormGroup>

              { this.renderPrices() }
              { editable && <CreateButton onClick={this.onProductRateAdd} label="Add New" />}
              <Col lg={12} md={12}>
                <FormGroup>
                  { editable
                    ? (
                      <Checkbox checked={vatable} onChange={this.onChangeVatable}>
                        This product is taxable
                      </Checkbox>
                    )
                    :
                    (
                      <div className="non-editable-field">
                        { vatable
                          ? 'This product is taxable'
                          : 'This product is not taxable'
                        }
                      </div>
                    )
                }
                </FormGroup>
              </Col>
            </Panel>

            <Panel header={<h3>Additional Parameters</h3>}>
              { this.renderParameters() }
              { editable && <CreateButton onClick={this.onProductParamAdd} label="Add New" />}
            </Panel>

            {this.renderNewProductParam()}

          </Form>
        </Col>
      </Row>
    );
  }

}
