import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Form, FormGroup, ControlLabel, Col, Row, Panel, Label } from 'react-bootstrap';
import getSymbolFromCurrency from 'currency-symbol-map';
import { titleCase, paramCase } from 'change-case';
import isNumber from 'is-number';
import DiscountServiceValue from './Elements/DiscountServiceValue';
import DiscountConditions from './Elements/DiscountConditions';
import Field from '@/components/Field';
import { EntityFields, EntityField } from '@/components/Entity';
import { getFieldName, getConfig } from '@/common/Util';
import { DiscountDescription } from '../../language/FieldDescriptions';
import { entitiesOptionsSelector } from '@/selectors/listSelectors';
import { getSettings } from '@/actions/settingsActions';
import { getEntitiesOptions, clearEntitiesOptions } from '@/actions/listActions';


class DiscountDetails extends Component {

  static propTypes = {
    discount: PropTypes.instanceOf(Immutable.Map),
    mode: PropTypes.string.isRequired,
    currency: PropTypes.string,
    errorMessages: PropTypes.object,
    onFieldUpdate: PropTypes.func.isRequired,
    onFieldRemove: PropTypes.func.isRequired,
    availableEntities: PropTypes.instanceOf(Immutable.Map),
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    discount: Immutable.Map(),
    fields: Immutable.Map({
      description: Immutable.Map({
        title: getFieldName('Title', 'discounts'),
        field_name: 'description',
        mandatory: true,
        description: DiscountDescription.description
      }),
      key: Immutable.Map({
        title: getFieldName('Key', 'discounts'),
        field_name: 'key',
        mandatory: true,
        description: DiscountDescription.key
      }),
      priority: Immutable.Map({
        title: getFieldName('Priority', 'discounts'),
        field_name: 'priority',
        system: true,
        type: 'number'
      }),
      paramsMinSubscribers: Immutable.Map({
        title: getFieldName('Max Subscribers', 'discounts'),
        field_name: 'params.min_subscribers',
        system: true,
        type: 'number'
      }),
      paramsMaxSubscribers: Immutable.Map({
        title: getFieldName('Min Subscribers', 'discounts'),
        field_name: 'params.max_subscribers',
        system: true,
        type: 'number'
      }),
      proration: Immutable.Map({
        field_name: 'proration',
        title:  getFieldName('Prorated', 'discounts'),
        select_list: true,
        select_options: [
            Immutable.Map({value: 'inherited', label: 'Inherited'}),
          Immutable.Map({value: false, label: 'No'})
        ],
        default_value: 'inherited',
      }),
    }),
    currency: '',
    availableEntities: Immutable.Map(),
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
  }

  componentWillMount() {
    this.props.dispatch(getSettings([
      'subscribers.subscriber',
      'subscribers.account',
    ]));
    this.props.dispatch(getEntitiesOptions(['discount', 'plan', 'service']));
  }

  componentWillUnmount() {
    this.props.dispatch(clearEntitiesOptions(['discount', 'plan', 'service']));
  }

  onChangeFiled = (path, value) => {
    const pathString = path.join('.');
    switch (pathString) {
      case 'limit':
      case 'cycles':
        if (value !== '') {
          this.props.onFieldUpdate(path, value);
        } else {
          this.props.onFieldRemove(path);
        }
      break;
      case 'key':
        const valueKey = value.toUpperCase();
        if (value !== '') {
          const { errorMessages: { name: { allowedCharacters } } } = this.props;
          const { errors } = this.state;
          const newError = (!getConfig('keyUppercaseRegex', /./).test(valueKey)) ? allowedCharacters : '';
          this.setState({ errors: Object.assign({}, errors, { name: newError }) });
        }
        this.props.onFieldUpdate(path, valueKey);
        break;
      default: this.props.onFieldUpdate(path, value);
    }
  }

  onChangeCycles = (value) => {
    const newValue = isNumber(value) ? parseFloat(value) : value;
    this.onChangeFiled(['cycles'], newValue);
  }

  onChangeLimit = (value) => {
    const newValue = isNumber(value) ? parseFloat(value) : value;
    this.onChangeFiled(['limit'], newValue);
  }

  onChangeDiscountType = (e) => {
    const { value } = e.target;
    this.onChangeFiled(['discount_type'], value);
  }

  onChangeAdditionalField = (field, value) => {
    this.onChangeFiled(field, value);
  }

  onRemoveAdditionalField = (field) => {
    this.props.onFieldRemove(field);
  }

  onChangeExcludes = (excludeDiscounts) => {
    const newValuesArray = Immutable.List((excludeDiscounts.length) ? excludeDiscounts.split(',') : []);
    if (newValuesArray.isEmpty()) {
      this.props.onFieldRemove(['excludes']);
    } else {
      this.onChangeFiled(['excludes'], newValuesArray);
    }
  }

  onChangeService = (services) => {
    const { discount } = this.props;
    const newValuesArray = Immutable.List((services.length) ? services.split(',') : []);
    const defaultNewValue = Immutable.Map({value:''});
    if (newValuesArray.isEmpty()) {
      this.props.onFieldRemove(['subject', 'service']);
      this.props.onFieldRemove(['matched_services']);
    } else {
      const existsServices = discount.getIn(['subject', 'service'], Immutable.Map());
      const updatedServicesList = Immutable.Map().withMutations((plansWithMutations) => {
        newValuesArray.forEach((newServiceName) => {
          if (newServiceName !== 'matched_services') {
            plansWithMutations.set(newServiceName, existsServices.get(newServiceName, defaultNewValue));
          }
        });
      });
      if (!updatedServicesList.isEmpty()) {
        this.onChangeFiled(['subject', 'service'], updatedServicesList);
      } else {
        this.props.onFieldRemove(['subject', 'service']);
      }
      if (newValuesArray.includes('matched_services')) {
        this.onChangeFiled(['matched_services'], discount.get('matched_services', defaultNewValue));
      } else {
        this.props.onFieldRemove(['matched_services']);
      }
    }
  }

  onChangePlan = (plans) => {
    const { discount } = this.props;
    const newValuesArray = Immutable.List((plans.length) ? plans.split(',') : []);
    const defaultNewValue = Immutable.Map({value:''});
    if (newValuesArray.isEmpty()) {
      this.props.onFieldRemove(['subject', 'plan']);
      this.props.onFieldRemove(['matched_plans']);
      this.props.onFieldRemove(['monthly_fees']);
    } else {
      const existsPlans = this.getSelectedPlans();
      const updatedPalsList = Immutable.Map().withMutations((plansWithMutations) => {
        newValuesArray.forEach((planFromList) => {
          if (!['matched_plans', 'monthly_fees'].includes(planFromList)) {
            plansWithMutations.set(planFromList, existsPlans.get(planFromList, defaultNewValue));
          }
        });
      });
      if (!updatedPalsList.isEmpty()) {
        this.onChangeFiled(['subject', 'plan'], updatedPalsList);
      } else {
        this.props.onFieldRemove(['subject', 'plan']);
      }
      if (newValuesArray.includes('matched_plans')) {
        this.onChangeFiled(['matched_plans'], discount.get('matched_plans', defaultNewValue));
      } else {
        this.props.onFieldRemove(['matched_plans']);
      }
      if (newValuesArray.includes('monthly_fees')) {
        this.onChangeFiled(['monthly_fees'], discount.get('monthly_fees', defaultNewValue));
      } else {
        this.props.onFieldRemove(['monthly_fees']);
      }
    }
  }

  onChangePlanDiscountValue = (e) => {
    const { value, id:planName } = e.target;
    if (['matched_plans', 'monthly_fees'].includes(planName)) {
      this.onChangeFiled([planName], Immutable.Map({ value }));
    } else {
      this.onChangeFiled(['subject', 'plan', planName], Immutable.Map({ value }));
    }
  }

  onChangeServiceDiscountValue = (serviceKey, newSubject) => {
    if ([serviceKey].includes('matched_services')) {
      this.onChangeFiled([serviceKey], newSubject);
    } else {
      this.onChangeFiled(['subject', 'service', serviceKey], newSubject);
    }
  }

  onChangeConditionField = (path, index, value) => {
    this.onChangeFiled([...path, index, 'field'], value);
  }

  onChangeConditionOp = (path, index, value) => {
    this.onChangeFiled([...path, index, 'op'], value);
  }

  onChangeConditionValue = (path, index, value) => {
    this.onChangeFiled([...path, index, 'value'], value);
  }

  onAddCondition = (path, condition) => {
    const { discount } = this.props;
    const conditions = discount.getIn(path, Immutable.List());
    this.onChangeFiled(path, conditions.push(condition));
  }

  onRemoveCondition = (path, index) => {
    const { discount } = this.props;
    const conditions = discount.getIn(path, Immutable.List());
    this.onChangeFiled(path, conditions.delete(index));
  }

  createPlansOptions = () => this.props.availableEntities
    .get('plan', Immutable.List())
    .push(Immutable.Map({name: 'matched_plans', description: 'Matched Plans'}))
    .push(Immutable.Map({name: 'monthly_fees', description: 'Plans and included services'}))
    .map(this.createOption)
    .toArray();

  createExcludeDiscountOptions = () => {
    const { discount, availableEntities } = this.props;
    return availableEntities
     .get('discount', Immutable.List())
     .filter(option => option.get('key', '') !== discount.get('key', ''))
     .map(this.createOption)
     .toArray();
  }

  createServicesOptions = () => {
    const { availableEntities } = this.props;
    const isPercentaget = this.isPercentaget();
    return availableEntities
      .get('service', Immutable.List())
      .filter(availableService => !(isPercentaget && availableService.get('quantitative', false)))
      .push(Immutable.Map({name: 'matched_services', description: 'Matched Services'}))
      .map(this.createOption)
      .toArray();
  }

  createOption = item => ({
    value: item.get('name', item.get('key', '')),
    label: item.get('description', ''),
  })

  getLabel = (items, key) => {
    if ('matched_services' === key) {
      return 'Matched Services';
    }
    if ('matched_plans' === key) {
      return 'Matched Plans';
    }
    if ('monthly_fees' === key) {
      return 'Plans and included services';
    }
    return items
      .find(item => item.get('name') === key, null, Immutable.Map())
      .get('description', key);
  }

  getSelectedServices = () => {
    const { discount } = this.props;
    let services = discount.getIn(['subject', 'service'], Immutable.Map());
    if (discount.has('matched_services')) {

      services = services.set('matched_services', discount.get('matched_services',Immutable.Map({value:''})));
    }
    return services;
  }

  getSelectedPlans = () => {
    const { discount } = this.props;
    let plans = discount.getIn(['subject', 'plan'], Immutable.Map());
    if (discount.has('matched_plans')) {
      plans = plans.set('matched_plans', discount.get('matched_plans', Immutable.Map({value:''})));
    }
    if (discount.has('monthly_fees')) {
      plans = plans.set('monthly_fees', discount.get('monthly_fees', Immutable.Map({value:''})));
    }
    return plans;
  }

  isServiceQuantitative = (name) => {
    const { availableEntities } = this.props;
    return availableEntities
      .get('service', Immutable.List())
      .findIndex(service => (
        service.get('name', '') === name && service.get('quantitative', false) === true
      )) !== -1;
  }

  isPercentaget = () => {
    const { discount } = this.props;
    return discount.get('discount_type', '') === 'percentage'
  }

  renderServivesDiscountValues = () => {
    const { availableEntities, mode, currency } = this.props;
    const discountSubject = this.getSelectedServices();
    if (discountSubject.isEmpty()) {
      return null;
    }
    const isPercentaget = this.isPercentaget();
    return discountSubject.map((service, serviceName) => {
      const label = this.getLabel(availableEntities.get('service', Immutable.List()), serviceName);
      const isQuantitative = this.isServiceQuantitative(serviceName);
      return (
        <DiscountServiceValue
          key={`${paramCase(serviceName)}-discount-value`}
          mode={mode}
          service={service}
          name={serviceName}
          label={label}
          isQuantitative={isQuantitative}
          isPercentaget={isPercentaget}
          currency={currency}
          onChange={this.onChangeServiceDiscountValue}
        />
      );
    })
    .toList()
    .toArray();
  }

  renderPlanDiscountValue = () => {
    const { availableEntities, mode, currency } = this.props;
    const plans = this.getSelectedPlans();
    if (plans.isEmpty()) {
      return null;
    }
    const editable = (mode !== 'view');
    const isPercentaget = this.isPercentaget();
    const suffix = isPercentaget ? undefined : getSymbolFromCurrency(currency);
    return plans
      .filter(value => (
        editable || (!editable && Immutable.Map.isMap(value) && value.get('value', '') !== '')
      ))
      .map((value, planName) =>(
        <FormGroup key={`${paramCase(planName)}-discount-value`}>
          <Col componentClass={ControlLabel} sm={3} lg={2}>
            { this.getLabel(availableEntities.get('plan', Immutable.List()), planName) }
          </Col>
          <Col sm={8} lg={9}>
            <Field
              id={planName}
              fieldType={isPercentaget ? "percentage" : "number"}
              value={value.get('value', '')}
              onChange={this.onChangePlanDiscountValue}
              editable={editable}
              suffix={suffix}
            />
          </Col>
        </FormGroup>
      ))
      .toList()
      .toArray()
  }

  render() {
    const { errors } = this.state;
    const { discount, mode, currency, fields } = this.props;
    const editable = (mode !== 'view');
    const isPercentaget = this.isPercentaget();
    const plansOptions = this.createPlansOptions();
    const servicesOptions = this.createServicesOptions();
    const excludeDiscounts = discount.get('excludes', Immutable.List()).join(',');
    const excludeDiscountsOptions = this.createExcludeDiscountOptions();
    const services = this.getSelectedServices().keySeq().toList().join(',');
    const plans = this.getSelectedPlans().keySeq().toList().join(',');
    const includesQuantitative = discount
      .getIn(['subject', 'service'], Immutable.Map())
      .keySeq().toList()
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
              <EntityField
                field={fields.get('description')}
                entity={discount}
                onChange={this.onChangeFiled}
                editable={editable}
              />
              { ['clone', 'create'].includes(mode) &&
                <EntityField
                  field={fields.get('key')}
                  entity={discount}
                  onChange={this.onChangeFiled}
                  editable={editable}
                  disabled={!['clone', 'create'].includes(mode)}
                  error={errors.name}
                />
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
              <EntityField
                field={fields.get('proration')}
                entity={discount}
                onChange={this.onChangeFiled}
                editable={editable}
              />
              <EntityField
                field={fields.get('priority')}
                entity={discount}
                onChange={this.onChangeFiled}
                editable={editable}
              />
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  { getFieldName('Discount Overall Limit', 'discounts')}
                </Col>
                <Col sm={8} lg={9}>
                  <Field suffix={getSymbolFromCurrency(currency)} value={discount.get('limit', '')} onChange={this.onChangeLimit} fieldType="unlimited" unlimitedValue="" editable={editable} />
                </Col>
              </FormGroup>

              <EntityField
                field={fields.get('paramsMinSubscribers')}
                entity={discount}
                onChange={this.onChangeFiled}
                editable={editable}
              />
              <EntityField
                field={fields.get('paramsMaxSubscribers')}
                entity={discount}
                onChange={this.onChangeFiled}
                editable={editable}
              />
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  Excludes
                </Col>
                <Col sm={8} lg={9}>
                  <Field
                    fieldType="select"
                    multi={true}
                    value={excludeDiscounts}
                    options={excludeDiscountsOptions}
                    onChange={this.onChangeExcludes}
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
            </Panel>

            <DiscountConditions
              discount={discount}
              editable={editable}
              onChangeConditionField={this.onChangeConditionField}
              onChangeConditionOp={this.onChangeConditionOp}
              onChangeConditionValue={this.onChangeConditionValue}
              addCondition={this.onAddCondition}
              removeCondition={this.onRemoveCondition}
            />

            <Panel header={<h3>Plans Discount Values</h3>}>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  Select Plans
                </Col>
                <Col sm={8} lg={9}>
                  <Field
                    fieldType="select"
                    multi={true}
                    value={plans}
                    options={plansOptions}
                    onChange={this.onChangePlan}
                    editable={editable}
                  />
                </Col>
              </FormGroup>
              { (!this.getSelectedPlans().isEmpty()) && <hr /> }
              { this.renderPlanDiscountValue() }
              </Panel>
              <Panel header={<h3>Services Discount Values</h3>}>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  Select Services
                </Col>
                <Col sm={8} lg={9}>
                  <Field
                    fieldType="select"
                    multi={true}
                    value={services}
                    options={servicesOptions}
                    onChange={this.onChangeService}
                    editable={editable}
                  />
                </Col>
              </FormGroup>
              { (!this.getSelectedServices().isEmpty()) && <hr /> }
              { this.renderServivesDiscountValues() }
            </Panel>
          </Form>
        </Col>
      </Row>
    );
  }

}

const mapStateToProps = (state, props) => ({
  availableEntities: entitiesOptionsSelector(state, props, ['discount', 'plan', 'service']),
});

export default connect(mapStateToProps)(DiscountDetails);
