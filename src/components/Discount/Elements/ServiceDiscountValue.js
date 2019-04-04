import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import isNumber from 'is-number';
import { Form, FormGroup, ControlLabel, Col, HelpBlock, InputGroup } from 'react-bootstrap';
import getSymbolFromCurrency from 'currency-symbol-map';
import { ModalWrapper, Actions } from '@/components/Elements';
import Field from '@/components/Field';

class ServiceDiscountValue extends Component {

  static propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    discount: PropTypes.instanceOf(Immutable.Map),
    isQuantitative: PropTypes.bool.isRequired,
    mode: PropTypes.string.isRequired,
    currency: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    name: '',
    label: '',
    discount: Immutable.Map(),
    isQuantitative: false,
    currency: '',
  };

  state = {
    showAdvancedEdit: false,
  }

  isOldStructure = () => {
    const { name, discount } = this.props;
    const serviceDiscoun = discount.getIn(['discount_subject', 'service', name], Immutable.Map());
    return !Immutable.Map.isMap(serviceDiscoun);
  }

  onChangeValue = (val) => {
    const { name, discount } = this.props;
    if (val === null) { // delete
      this.props.onChange(name, null);
      return;
    }
    const value = isNumber(val) ? parseFloat(val) : val;
    const serviceDiscoun = discount.getIn(['discount_subject', 'service', name], Immutable.Map());
    const newValue = this.isOldStructure()
      ? Immutable.Map({ value })
      : serviceDiscoun.set('value', value);
    this.props.onChange(name, newValue);
  }

  onChangeAmount = (value) => {
    const { discount, name } = this.props;
    const currentDiscountValue = discount.getIn(['discount_subject', 'service', name], '');
    if (value === null || value === '') { // delete
      this.props.onChange(name, this.removeQuantity(currentDiscountValue));
      return;
    }
    let newAmount = isNumber(value) ? parseFloat(value) : value;
    newAmount = Number.isInteger(newAmount) ? newAmount : '';

    const newParam = Immutable.Map({
      name: 'quantity',
      value: newAmount,
    });
    const newOperation = Immutable.Map({
      name: 'recurring_by_quantity',
      params: Immutable.List([newParam]),
    });
    const newServiceValue = Immutable.Map({
      value: '',
      operations: Immutable.List([newOperation]),
    });

    if (this.isOldStructure()) { // No value Or Old structure
      this.props.onChange(name, newServiceValue.set('value', currentDiscountValue));
      return;
    }
    const operations = currentDiscountValue.get('operations', Immutable.List());
    const recurringByQuantityIdx = operations.findIndex(operation => operation.get('name') === 'recurring_by_quantity');
    if (recurringByQuantityIdx === -1) { // No operations - recurring_by_quantity
      const withNewOperation = currentDiscountValue.updateIn(
        ['operations'],
        Immutable.List(),
        ops => ops.push(newOperation),
      );
      this.props.onChange(name, withNewOperation);
      return;
    }
    const params = operations.getIn([recurringByQuantityIdx, 'params'], Immutable.List());
    const quantityIdx = params.findIndex(param => param.get('name', '') === 'quantity');
    if (quantityIdx === -1) { // No param - quantity
      const withQuantity = currentDiscountValue.updateIn(
        ['operations', recurringByQuantityIdx, 'params'],
        Immutable.List(),
        list => list.push(newParam),
      );
      this.props.onChange(name, withQuantity);
      return;
    }
    const withQuantity = currentDiscountValue.updateIn(
      ['operations', recurringByQuantityIdx, 'params', quantityIdx],
      Immutable.Map(),
      param => param.set('value', newAmount),
    );
    this.props.onChange(name, withQuantity);
  }

  onCloseModal = () => {
    this.setState({ showAdvancedEdit: false });
  };

  onOpenModal = () => {
    this.setState({ showAdvancedEdit: true });
  };

  removeQuantity = (currentDiscountValue) => {
    const operationsPath = ['operations'];

    const recurringByQuantityIndex = currentDiscountValue
      .getIn(operationsPath, Immutable.List())
      .findIndex(operation => operation.get('name', '') === 'recurring_by_quantity');

    const paramsPath = [...operationsPath, recurringByQuantityIndex, 'params'];
    const quantityIndex = recurringByQuantityIndex === -1
      ? -1
      : currentDiscountValue
        .getIn(paramsPath)
        .findIndex(param => param.get('name', '') === 'quantity');
    const quantityPath = [...paramsPath, quantityIndex];

    // remove quantity if exists
    const discountWithoutQuantity = (quantityIndex !== -1)
      ? currentDiscountValue.deleteIn(quantityPath)
      : currentDiscountValue;
    // remove params if empty
    const isParamEmpty = discountWithoutQuantity.getIn(paramsPath, Immutable.Map()).isEmpty();
    const discountWithoutParams = (recurringByQuantityIndex !== -1 && isParamEmpty)
        ? discountWithoutQuantity.deleteIn(paramsPath)
        : discountWithoutQuantity;
    // remove recurring_by_quantity if empty
    const recurringByQuantitySize = discountWithoutParams.getIn(paramsPath, Immutable.Map()).size; // can has {name:"recurring_by_quantity"} param
    const discountWithoutRecurringByQuantity = (recurringByQuantityIndex !== -1 && recurringByQuantitySize < 2)
        ? discountWithoutParams.deleteIn([...operationsPath, recurringByQuantityIndex])
        : discountWithoutParams;
    // remove operations if empty
    const isOperationsEmpty = discountWithoutRecurringByQuantity
      .getIn(operationsPath, Immutable.Map())
      .isEmpty();
    const discountWithoutOperations = isOperationsEmpty
        ? discountWithoutRecurringByQuantity.deleteIn(operationsPath)
        : discountWithoutRecurringByQuantity;
    return discountWithoutOperations;
  }

  getDiscountValue = () => {
    const { name, discount } = this.props;
    if (this.isOldStructure()) {
      return discount.getIn(['discount_subject', 'service', name], '');
    }
    return discount.getIn(['discount_subject', 'service', name, 'value'], '');
  }

  getDiscountAmount = () => {
    const { discount, name } = this.props;
    return discount.getIn(['discount_subject', 'service', name, 'operations'], Immutable.List())
      .find(operation => operation.get('name') === 'recurring_by_quantity', null, Immutable.Map())
      .get('params', Immutable.List())
      .find(param => param.get('name', '') === 'quantity', null, Immutable.Map())
      .get('value', '');
  }

  renderAdvancedEdit = () => {
    const { showAdvancedEdit } = this.state;
    const { label, mode, isQuantitative } = this.props;
    if (!showAdvancedEdit) {
      return null;
    }
    const title = `Edit ${label} service value options`;
    const editable = (mode !== 'view');

    return (
      <ModalWrapper show={true} onOk={this.onCloseModal} title={title}>
        <Form horizontal>
          {isQuantitative && (
            <FormGroup>
              <Col sm={11} smOffset={1}>
                <Field
                  fieldType="toggeledInput"
                  value={this.getDiscountAmount()}
                  disabledDisplayValue=""
                  disabledValue=""
                  onChange={this.onChangeAmount}
                  label={`Apply discount value ${this.getDiscountValue()} for every`}
                  editable={editable}
                  suffix="units"
                  style={{ width: 300 }}
                  inputProps={{ fieldType: 'number', style: { width: 85 }, min: 1 }}
                />
              </Col>
            </FormGroup>
          )}
        </Form>
      </ModalWrapper>
    );
  }

  renderQuantitativeDescription = () => {
    const discountAmount = this.getDiscountAmount();
    const discountValue = this.getDiscountValue();
    if (['', null].includes(discountAmount) && discountValue) {
      return (
        <HelpBlock>
          Amount will be multiplied by the subscriber&apos;s service quantity
        </HelpBlock>
      );
    }
    if (discountValue) {
      return (
        <HelpBlock>
          Apply discount value {discountValue} for every {discountAmount} units
        </HelpBlock>
      );
    }
    return null;
  }

  renderSuffix = () => {
    const { discount, currency } = this.props;
    const isPercentaget = discount.get('discount_type', '') === 'percentage';
    if (isPercentaget) {
      return '%';
    }
    return getSymbolFromCurrency(currency);
  }

  getActions = () => {
    const { mode, isQuantitative } = this.props;
    const value = this.getDiscountValue();
    return ([{
      type: 'settings',
      onClick: this.onOpenModal,
      show: mode !== 'view' && isQuantitative,
      actionSize: 'small',
      enable: ![null, ''].includes(value),
      helpText: 'Advanced Options',
    }]);
  }

  render() {
    const { name, label, mode, discount, isQuantitative } = this.props;
    if (name === '') {
      return null;
    }
    const editable = (mode !== 'view');
    const value = this.getDiscountValue();
    if (!editable && value === null) {
      return null;
    }
    const actions = this.getActions();
    const hasEnabledActions = actions
      .reduce((acc, action) => (action.show !== false ? true : acc), false);
    return (
      <FormGroup>
        <Col componentClass={ControlLabel} sm={3} lg={2}>
          { label }
        </Col>
        <Col sm={8} lg={9}>
          <InputGroup style={{ width: '100%' }}>
            <Field
              value={value}
              onChange={this.onChangeValue}
              label="Discount by"
              fieldType="toggeledInput"
              editable={editable}
              suffix={this.renderSuffix()}
              inputProps={{ fieldType: 'number' }}
            />
            { hasEnabledActions && (
              <InputGroup.Addon style={{ padind: 0 }}>
                <Actions actions={actions} data={discount} />
              </InputGroup.Addon>
            )}
          </InputGroup>
          { isQuantitative && this.renderQuantitativeDescription() }
          { this.renderAdvancedEdit() }
        </Col>
      </FormGroup>
    );
  }
}

export default ServiceDiscountValue;
