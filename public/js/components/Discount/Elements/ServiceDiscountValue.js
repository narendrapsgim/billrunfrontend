import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
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
    availableServices: PropTypes.instanceOf(Immutable.List),
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    name: '',
    label: '',
    discount: Immutable.Map(),
    currency: '',
    availableServices: Immutable.List(),
  };

  state = {
    showAdvancedEdit: false,
  }

  onChangeValue = (value) => {
    const { name, discount } = this.props;
    const serviceDiscoun = discount.getIn(['discount_subject', 'service', name], Immutable.Map());
    if (Immutable.Map.isMap(serviceDiscoun)) {
      const updatedDiscount = serviceDiscoun.set('value', value);
      this.props.onChange(name, updatedDiscount);
    } else {
      const newValue = Immutable.Map({
        value,
      });
      this.props.onChange(name, newValue);
    }
  }

  onChangeAmount = (e) => {
    const { value } = e.target;
    const newValue = Immutable.Map({
      name: 'quantity',
      value,
    });
    const newoperation = Immutable.Map({
      name: 'recurring_by_quantity',
      params: Immutable.List([
        newValue,
      ]),
    });
    const newService = Immutable.Map({
      value: '',
      operations: Immutable.List([
        newoperation,
      ]),
    });

    const { discount, name } = this.props;
    let updatedDiscount = false;
    const serviceDiscoun = discount.getIn(['discount_subject', 'service', name], Immutable.Map());
    if (!Immutable.Map.isMap(serviceDiscoun)) {
      updatedDiscount = discount.updateIn(['discount_subject', 'service', name], val => newService.set('value', val));
    } else {
      const operations = discount.getIn(['discount_subject', 'service', name, 'operations'], Immutable.List());
      const recurringByQuantityIdx = operations.findIndex(operation => operation.get('name') === 'recurring_by_quantity');
      if (recurringByQuantityIdx !== -1) {
        const params = operations.getIn([recurringByQuantityIdx, 'params'], Immutable.List());
        const quantityIdx = params.findIndex(param => param.get('name', '') === 'quantity');
        if (quantityIdx !== -1) {
          updatedDiscount = discount.updateIn(
            ['discount_subject', 'service', name, 'operations', recurringByQuantityIdx, 'params', quantityIdx],
            Immutable.Map(),
            param => param.set('value', value),
          );
        } else {
          updatedDiscount = discount.updateIn(['discount_subject', 'service', name, 'operations', recurringByQuantityIdx], Immutable.List(), list => list.push(newValue));
        }
      } else {
        updatedDiscount = discount.updateIn(['discount_subject', 'service', name, 'operations'], Immutable.List(), list => list.push(newoperation));
      }
    }
    const setValue = updatedDiscount.getIn(['discount_subject', 'service', name], Immutable.Map());
    this.props.onChange(name, setValue);
  }

  onCloseModal = () => {
    this.setState({ showAdvancedEdit: false });
  };

  onOpenModal = () => {
    this.setState({ showAdvancedEdit: true });
  };

  getDiscountValue = () => {
    const { name, discount } = this.props;
    if (Immutable.Map.isMap(discount.getIn(['discount_subject', 'service', name], ''))) {
      return discount.getIn(['discount_subject', 'service', name, 'value'], '');
    }
    return discount.getIn(['discount_subject', 'service', name], '');
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
              Apply discount value {discountValue} for every
              &nbsp;<Field
                style={{ width: 50, display: 'inline-block' }}
                onChange={this.onChangeAmount}
                value={discountAmount}
              />&nbsp;
             units
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
    let info = 'Amount will be multiplied by the subscriber\'s service quantity';
    if (discountAmount > 1) {
      const discountValue = this.getDiscountValue();
      info = `Apply discount value ${discountValue} for every ${discountAmount} units`;
    }
    return (
      <HelpBlock>
        { editable && (
          <Button onClick={this.onOpenModal} bsSize="xsmall" title="Advanced options" bsStyle="link">
            <i className="fa fa-cog fa-fw active-blue" />
          </Button>
        )}
        { info }
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

const mapStateToProps = (state, props) => ({
  isQuantitative: (props.availableServices.findIndex(service => (
    service.get('name', '') === props.name
    && service.get('quantitative', false) === true
  )) !== -1),
});

export default connect(mapStateToProps)(ServiceDiscountValue);
