import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Form, FormGroup, ControlLabel, Col, Row, Panel, Checkbox, HelpBlock } from 'react-bootstrap';
import Help from '../Help';
import Field from '../Field';
import CreateButton from '../Elements/CreateButton';
import { ProductDescription } from '../../FieldDescriptions';
import ProductPrice from './components/ProductPrice';
import EntityFields from '../Entity/EntityFields';
import UsageTypesSelector from '../UsageTypes/UsageTypesSelector';
import { getUnitLabel } from '../../common/Util';
import {
  usageTypesDataSelector,
  propertyTypeSelector,
} from '../../selectors/settingsSelector';


class Product extends Component {

  static propTypes = {
    usageTypesData: PropTypes.instanceOf(Immutable.List),
    propertyTypes: PropTypes.instanceOf(Immutable.List),
    ratingParams: PropTypes.instanceOf(Immutable.List),
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
    usageTypesData: Immutable.List(),
    propertyTypes: Immutable.List(),
    ratingParams: Immutable.List(),
    planName: 'BASE',
    product: Immutable.Map(),
    usaget: undefined,
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
    unit: null,
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

  onChangeDescription = (e) => {
    const { value } = e.target;
    this.props.onFieldUpdate(['description'], value);
  }

  onChangeUsaget = (value) => {
    const { usaget } = this.props;
    this.props.onUsagetUpdate(['rates'], usaget, value);
  }

  onChangeUnit = (unit, usageType) => {
    const { product, planName, usaget } = this.props;
    const usageTypeForRate = usageType || usaget;
    const ratePath = ['rates', usageTypeForRate, planName, 'rate'];
    const rates = product.getIn(ratePath, Immutable.List());
    this.setState({ unit });
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

  onChangePricingMethod = (e) => {
    const { value } = e.target;
    this.props.onFieldUpdate(['pricing_method'], value);
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

  filterCustomFields = ratingParams => (field) => {
    const fieldName = field.get('field_name', '');
    const usedAsRatingField = ratingParams.includes(fieldName);
    return (!fieldName.startsWith('params.') || usedAsRatingField) && field.get('display', false) !== false && field.get('editable', false) !== false;
  };

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
        unit={this.getUnitLabel()}
        onProductEditRate={this.onProductRateUpdate}
        onProductRemoveRate={this.onProductRateRemove}
      />
    );
  }

  getUnit = () => {
    const { product, usaget } = this.props;
    const { unit } = this.state;
    if (unit === null) {
      return product.getIn(['rates', usaget, 'BASE', 'rate', 0, 'uom_display', 'range'], '');
    }
    return unit;
  }

  getUnitLabel = () => {
    const { propertyTypes, usageTypesData, usaget } = this.props;
    return getUnitLabel(propertyTypes, usageTypesData, usaget, this.getUnit());
  }

  render() {
    const { errors } = this.state;
    const { product, usaget, mode, ratingParams } = this.props;
    const unit = this.getUnit();
    const unitTxt = this.getUnitLabel();
    const unitLabel = unitTxt !== '' ? `(${unitTxt})` : '';
    const vatable = (product.get('vatable', true) === true);
    const pricingMethod = product.get('pricing_method', '');
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
                <Col componentClass={ControlLabel} sm={3} lg={2}>Unit Type</Col>
                <Col sm={8}>
                  { editable && ['clone', 'create'].includes(mode)
                    ? (
                      <UsageTypesSelector
                        usaget={usaget}
                        unit={unit}
                        onChangeUsaget={this.onChangeUsaget}
                        onChangeUnit={this.onChangeUnit}
                      />
                    )
                    : <div className="non-editable-field">{ `${usaget} ${unitLabel}` }</div>
                  }
                </Col>
              </FormGroup>

              <EntityFields
                entityName="rates"
                entity={product}
                onChangeField={this.onChangeAdditionalField}
                fieldsFilter={this.filterCustomFields(ratingParams)}
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

          </Form>
        </Col>
      </Row>
    );
  }

}

const mapStateToProps = (state, props) => ({
  usageTypesData: usageTypesDataSelector(state, props),
  propertyTypes: propertyTypeSelector(state, props),
});

export default connect(mapStateToProps)(Product);
