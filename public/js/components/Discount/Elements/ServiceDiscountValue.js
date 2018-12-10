import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import isNumber from 'is-number';
import { Form, FormGroup, ControlLabel, Col, HelpBlock, Button } from 'react-bootstrap';
import getSymbolFromCurrency from 'currency-symbol-map';
import { ModalWrapper } from '../../Elements';
import Field from '../../Field';

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
    const value = isNumber(val) ? parseFloat(val) : val;
    const serviceDiscoun = discount.getIn(['discount_subject', 'service', name], Immutable.Map());
    const newValue = this.isOldStructure()
      ? Immutable.Map({ value })
      : serviceDiscoun.set('value', value);
    this.props.onChange(name, newValue);
  }

  onChangeAmount = (e) => {
    const { discount, name } = this.props;
    let { value } = e.target;
    value = isNumber(value) ? parseFloat(value) : value;

    const newParam = Immutable.Map({
      name: 'quantity',
      value,
    });
    const newOperation = Immutable.Map({
      name: 'recurring_by_quantity',
      params: Immutable.List([newParam]),
    });
    const newServiceValue = Immutable.Map({
      value: '',
      operations: Immutable.List([newOperation]),
    });

    const currentDiscountValue = discount.getIn(['discount_subject', 'service', name], '');
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
      param => param.set('value', value),
    );
    this.props.onChange(name, withQuantity);
  }

  onCloseModal = () => {
    this.setState({ showAdvancedEdit: false });
  };

  onOpenModal = () => {
    this.setState({ showAdvancedEdit: true });
  };

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
      .get('value', 1);
  }

  renderAdvancedEdit = () => {
    const { showAdvancedEdit } = this.state;
    const { label } = this.props;
    if (!showAdvancedEdit) {
      return null;
    }
    const title = `Edit ${label} service value options`;
    const discountValue = this.getDiscountValue();
    const discountAmount = this.getDiscountAmount();

    return (
      <ModalWrapper show={true} onOk={this.onCloseModal} title={title}>
        <Form horizontal>
          <FormGroup>
            <Col sm={12}>
              Apply discount value {discountValue} for every &nbsp;
              <Field
                style={{ width: 50, display: 'inline-block' }}
                onChange={this.onChangeAmount}
                value={discountAmount}
              />
             &nbsp;units
            </Col>
          </FormGroup>
        </Form>
      </ModalWrapper>
    );
  }

  renderQuantitativeDescription = () => {
    const { isQuantitative, mode } = this.props;
    if (!isQuantitative) {
      return null;
    }
    const editable = (mode !== 'view');
    const discountAmount = this.getDiscountAmount();
    const discountValue = this.getDiscountValue();

    const details = ([1, '1'].includes(discountAmount))
      ? 'Amount will be multiplied by the subscriber\'s service quantity'
      : `Apply discount value ${discountValue} for every ${discountAmount} units`;

    return (
      <HelpBlock>
        { editable && (
          <Button onClick={this.onOpenModal} bsSize="xsmall" title="Advanced options" bsStyle="link">
            <i className="fa fa-cog fa-fw active-blue" />
          </Button>
        )}
        { details }
      </HelpBlock>
    );
  }

  renderSuffix = () => {
    const { discount, currency } = this.props;
    const isPercentaget = discount.get('discount_type', '') === 'percentage';
    if (isPercentaget) {
      return (<i className="fa fa-percent" />);
    }
    return getSymbolFromCurrency(currency);
  }

  render() {
    const { name, label, mode } = this.props;
    if (name === '') {
      return null;
    }
    const editable = (mode !== 'view');
    const value = this.getDiscountValue();
    if (!editable && value === null) {
      return null;
    }
    return (
      <FormGroup>
        <Col componentClass={ControlLabel} sm={3} lg={2}>
          { label }
        </Col>
        <Col sm={8} lg={9}>
          <Field
            value={value}
            onChange={this.onChangeValue}
            label="Discount by"
            fieldType="toggeledInput"
            editable={editable}
            suffix={this.renderSuffix()}
            inputProps={{ fieldType: 'number' }}
          />
          { this.renderQuantitativeDescription() }
        </Col>
        { this.renderAdvancedEdit() }
      </FormGroup>
    );
  }
}

export default ServiceDiscountValue;
