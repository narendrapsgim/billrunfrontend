import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, ControlLabel, Col, Row, Panel, HelpBlock, Label } from 'react-bootstrap';
import Select from 'react-select';
import getSymbolFromCurrency from 'currency-symbol-map';
import { titleCase, paramCase } from 'change-case';
import isNumber from 'is-number';
import ServiceDiscountValue from './Elements/ServiceDiscountValue';
import Help from '../Help';
import Field from '../Field';
import EntityFields from '../Entity/EntityFields';
import { getFieldName, getConfig } from '../../common/Util';
import { DiscountDescription } from '../../FieldDescriptions';


export default class DiscountDetails extends Component {

  static propTypes = {
    discount: PropTypes.instanceOf(Immutable.Map),
    mode: PropTypes.string.isRequired,
    currency: PropTypes.string,
    errorMessages: PropTypes.object,
    onFieldUpdate: PropTypes.func.isRequired,
    onFieldRemove: PropTypes.func.isRequired,
    availablePlans: PropTypes.instanceOf(Immutable.List),
    availableServices: PropTypes.instanceOf(Immutable.List),
  }

  static defaultProps = {
    discount: Immutable.Map(),
    currency: '',
    availablePlans: Immutable.List(),
    availableServices: Immutable.List(),
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

  onChangeName = (e) => {
    const { errorMessages: { name: { allowedCharacters } } } = this.props;
    const { errors } = this.state;
    const value = e.target.value.toUpperCase();
    const newError = (!getConfig('keyUppercaseRegex', /./).test(value)) ? allowedCharacters : '';
    this.setState({ errors: Object.assign({}, errors, { name: newError }) });
    this.props.onFieldUpdate(['key'], value);
  }

  onChangeDescription = (e) => {
    const { value } = e.target;
    this.props.onFieldUpdate(['description'], value);
  }

  onChangeCycles = (value) => {
    const newValue = isNumber(value) ? parseFloat(value) : value;
    this.props.onFieldUpdate(['cycles'], newValue);
  }

  onChangeProrated = (e) => {
    const { value } = e.target;
    this.props.onFieldUpdate(['prorated'], value);
  }

  onChangeLimit = (value) => {
    const newValue = isNumber(value) ? parseFloat(value) : value;
    this.props.onFieldUpdate(['limit'], newValue);
  }

  onChangeAdditionalField = (field, value) => {
    this.props.onFieldUpdate(field, value);
  }

  onRemoveAdditionalField = (field) => {
    this.props.onFieldRemove(field);
  }

  onChangeDiscountType = (e) => {
    const { value } = e.target;
    this.props.onFieldUpdate(['discount_type'], value);
  }

  onChangePlan = (plan) => {
    this.props.onFieldUpdate(['params', 'plan'], plan);
    this.props.onFieldUpdate(['discount_subject', 'plan'], null); // send null to remove property
  }

  onChangeService = (services) => {
    const { discount } = this.props;
    const servicesList = Immutable.List((services.length) ? services.split(',') : []);
    if (servicesList.isEmpty()) {
      this.props.onFieldUpdate(['params', 'service'], null); // send null to remove property
      this.props.onFieldUpdate(['discount_subject', 'service'], null); // send null to remove property
    } else {
      this.props.onFieldUpdate(['params', 'service'], servicesList);
      const discounts = discount.getIn(['discount_subject', 'service'], Immutable.Map());
      // set to Map if empty, server always return empty array in it empty
      const onlyExistDiscount = discounts.isEmpty()
        ? null // send null to remove property
        : discounts.filter((val, name) => servicesList.includes(name));
      this.props.onFieldUpdate(['discount_subject', 'service'], onlyExistDiscount);
    }
  }

  onChangeServiceDiscountValue = (key, value) => {
    this.onChangeDiscountValue(key, value, 'service');
  }

  onChangePlanDiscountValue = (key, value) => {
    this.onChangeDiscountValue(key, value, 'plan');
  }

  onChangeDiscountValue = (key, value, type) => {
    const { discount } = this.props;
    let discounts = discount.getIn(['discount_subject', type], Immutable.Map());
    if (value === null) { // removed discount
      discounts = discounts.filter((val, name) => name !== key);
    } else { // added discount
      const newValue = isNumber(value) ? parseFloat(value) : value;
      discounts = discounts.set(key, newValue);
    }
    this.props.onFieldUpdate(['discount_subject', type], discounts);
  }

  createPlansOptions = () => this.props.availablePlans
    .map(this.createOption)
    .toArray();

  createServicesOptions = () => {
    const { discount } = this.props;
    const isPercentaget = (discount.get('discount_type', '') === 'percentage');
    return this.props.availableServices
      .filter(availableService => !(isPercentaget && availableService.get('quantitative', false)))
    .map(this.createOption)
    .toArray();
  }

  createOption = item => ({
    value: item.get('name'),
    label: item.get('description'),
  })

  renderServivesDiscountValues = () => {
    const { discount, availableServices, mode, currency } = this.props;
    const discountSubject = discount.getIn(['params', 'service'], Immutable.List());
    return discountSubject.map((serviceName) => {
      const label = this.getLabel(availableServices, serviceName);
      const isQuantitative = this.isServiceQuantitative(serviceName);
      return (
        <ServiceDiscountValue
          key={`${paramCase(serviceName)}-discount-value`}
          mode={mode}
          discount={discount}
          name={serviceName}
          label={label}
          isQuantitative={isQuantitative}
          currency={currency}
          onChange={this.onChangeServiceDiscountValue}
        />
      );
    });
  }

  getLabel = (items, key) => items
    .find(item => item.get('name') === key, null, Immutable.Map())
    .get('description', key);

  renderPlanDiscountValue = () => {
    const { discount, availablePlans, mode, currency } = this.props;
    const planName = discount.getIn(['params', 'plan'], '');
    if (planName === '') {
    return null;
  }
    const editable = (mode !== 'view');
    const value = discount.getIn(['discount_subject', 'plan', planName], null);
    if (!editable && value === null) {
      return null;
    }
    const label = this.getLabel(availablePlans, planName);
    const isPercentaget = (discount.get('discount_type', '') === 'percentage');
    const suffix = isPercentaget ? <i className="fa fa-percent" /> : getSymbolFromCurrency(currency);
    return (
      <FormGroup key={`${paramCase(planName)}-discount-value`}>
        <Col componentClass={ControlLabel} sm={3} lg={2}>
          { label }
        </Col>
        <Col sm={8} lg={9}>
          <Field
            value={value}
            onChange={(val) => { this.onChangePlanDiscountValue(planName, val); }}
            label="Discount by"
            fieldType="toggeledInput"
            editable={editable}
            suffix={suffix}
            inputProps={{ fieldType: 'number' }}
          />
        </Col>
      </FormGroup>
    );
  }

  isServiceQuantitative = (name) => {
    const { availableServices } = this.props;
    return availableServices.findIndex(service => (
      service.get('name', '') === name && service.get('quantitative', false) === true
    )) !== -1;
  }

  render() {
    const { errors } = this.state;
    const { discount, mode, currency } = this.props;
    const editable = (mode !== 'view');
    const isPercentaget = discount.get('discount_type', '') === 'percentage';
    const plansOptions = this.createPlansOptions();
    const servicesOptions = this.createServicesOptions();
    const services = discount.getIn(['params', 'service'], Immutable.List()).join(',');
    const proratedValue = discount.get('prorated', true);
    const includesQuantitative = discount
      .getIn(['params', 'service'], Immutable.List())
      .reduce((acc, serviceName) => (this.isServiceQuantitative(serviceName) ? true : acc), false);
    const percentageLabel = (!includesQuantitative) ? 'Percentage' : (
      <span>
        Percentage&nbsp;
        <Label bsStyle="warning">
          not compatible with quantitative service type.
        </Label>
      </span>
    );

    return (
      <Row>
        <Col lg={12}>
          <Form horizontal>
            <Panel>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  { getFieldName('Title', 'discounts')}<Help contents={DiscountDescription.description} />
                </Col>
                <Col sm={8} lg={9}>
                  <Field onChange={this.onChangeDescription} value={discount.get('description', '')} editable={editable} />
                </Col>
              </FormGroup>

              { ['clone', 'create'].includes(mode) &&
                <FormGroup validationState={errors.name.length > 0 ? 'error' : null} >
                  <Col componentClass={ControlLabel} sm={3} lg={2}>
                    { getFieldName('Key', 'discounts')}<Help contents={DiscountDescription.key} />
                  </Col>
                  <Col sm={8} lg={9}>
                    <Field onChange={this.onChangeName} value={discount.get('key', '')} disabled={!['clone', 'create'].includes(mode)} editable={editable} />
                    { errors.name.length > 0 && <HelpBlock>{errors.name}</HelpBlock> }
                  </Col>
                </FormGroup>
              }

              <FormGroup >
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  { getFieldName('Type', 'discounts')}
                </Col>
                <Col sm={8} lg={9}>
                  { editable
                    ? (
                      <span>
                        <span style={{ display: 'inline-block', marginRight: 20 }}>
                          <Field fieldType="radio" onChange={this.onChangeDiscountType} name="discount_type" value="monetary" label="Monetary" checked={!isPercentaget} />
                        </span>
                        <span style={{ display: 'inline-block' }}>
                          <Field fieldType="radio" onChange={this.onChangeDiscountType} name="discount_type" value="percentage" label={percentageLabel} checked={isPercentaget} disabled={includesQuantitative} />
                        </span>
                      </span>
                    )
                  : <div className="non-editable-field">{ titleCase(discount.get('discount_type', '')) }</div>
                  }
                </Col>
              </FormGroup>

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  { getFieldName('Cycles', 'discounts')}
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={discount.get('cycles', '')} onChange={this.onChangeCycles} fieldType="unlimited" unlimitedValue="" unlimitedLabel="Infinite" editable={editable} />
                </Col>
              </FormGroup>
            </Panel>

            <FormGroup>
              <Col componentClass={ControlLabel} sm={3} lg={2}>Prorated?</Col>
              <Col sm={8} lg={9} style={{ paddingTop: 7 }}>
                <Field
                  value={proratedValue}
                  onChange={this.onChangeProrated}
                  fieldType="checkbox"
                  editable={editable}
                />
              </Col>
            </FormGroup>

              <EntityFields
                entityName="discounts"
                entity={discount}
                onChangeField={this.onChangeAdditionalField}
                onRemoveField={this.onRemoveAdditionalField}
                editable={editable}
              />

              <Panel header={<h3>Discount Conditions</h3>}>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={3} lg={2}>
                    { getFieldName('Plan', 'discounts')}
                  </Col>
                  <Col sm={8} lg={9}>
                    { editable
                      ? <Select options={plansOptions} value={discount.getIn(['params', 'plan'], '')} onChange={this.onChangePlan} />
                      : <div className="non-editable-field">{ discount.getIn(['params', 'plan'], '') }</div>
                    }
                  </Col>
                </FormGroup>

                <FormGroup>
                  <Col componentClass={ControlLabel} sm={3} lg={2}>
                    { getFieldName('Services', 'discounts')}
                  </Col>
                  <Col sm={8} lg={9}>
                    { editable
                      ? <Select multi={true} value={services} options={servicesOptions} onChange={this.onChangeService} />
                      : <div className="non-editable-field">{ discount.getIn(['params', 'service'], Immutable.List()).join(', ') }</div>
                    }
                  </Col>
                </FormGroup>
              </Panel>

              <Panel header={<h3>Discount Values</h3>}>
                { this.renderPlanDiscountValue() }
                { (discount.getIn(['params', 'plan'], '').length > 0) && <hr /> }
                { this.renderServivesDiscountValues() }
                { (!discount.getIn(['params', 'service'], Immutable.List()).isEmpty()) && <hr /> }
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={3} lg={2}>
                    { getFieldName('Discount Overall Limit', 'discounts')}
                  </Col>
                  <Col sm={8} lg={9}>
                    <Field suffix={getSymbolFromCurrency(currency)} value={discount.get('limit', '')} onChange={this.onChangeLimit} fieldType="unlimited" unlimitedValue="" editable={editable} />
                  </Col>
                </FormGroup>
            </Panel>
          </Form>
        </Col>
      </Row>
    );
  }

}
