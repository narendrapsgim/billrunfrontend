import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import moment from 'moment';
import { Form, FormGroup, Col, Button, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import Field from '../Field';

class Customer extends Component {

  static propTypes = {
    customer: PropTypes.instanceOf(Immutable.Map),
    supportedGateways: PropTypes.instanceOf(Immutable.List),
    onChangePaymentGateway: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    action: PropTypes.string,
    fields: PropTypes.instanceOf(Immutable.List),
  };

  static defaultProps = {
    action: 'create',
    customer: Immutable.Map(),
    fields: Immutable.List(),
    supportedGateways: Immutable.List(),
  };

  componentDidMount() {
    const { action } = this.props;
    if (action === 'create') {
      this.initDefaultValues()
    }
  }

  initDefaultValues = () => {
    const { fields } = this.props;
    fields.forEach((field) => {
      if (field.has('default_value')) {
        const e = { target: {
          id: field.get('field_name', ''),
          value: field.get('default_value', ''),
        } };
        this.props.onChange(e);
      }
    });
  }

  onSelect = (value, field) => {
    const e = { target: { id: field[0].field, value } };
    this.props.onChange(e);
  };

  onChangePaymentGateway = () => {
    const { customer } = this.props;
    const aid = customer.get('aid', null);
    this.props.onChangePaymentGateway(aid);
  }

  filterPrinableFields = field => (field.get('display') !== false && field.get('editable') !== false);

  renderPaymentGatewayLabel = () => {
    const { customer, supportedGateways } = this.props;
    const customerPgName = customer.getIn(['payment_gateway', 'name'], '');
    const pg = supportedGateways.filter(item => customerPgName === item.get('name'));
    return (!pg.isEmpty() && pg.get(0).get('image_url', '').length > 0)
      ? <img src={`${globalSetting.serverUrl}/${pg.get(0).get('image_url', '')}`} height="30" alt={pg.get(0).get('name', '')} />
      : customerPgName;
  }

  renderChangePaymentGateway = () => {
    const { customer } = this.props;
    const hasPaymentGateway = !(customer.get('payment_gateway', Immutable.Map()).isEmpty());
    const label = hasPaymentGateway ? this.renderPaymentGatewayLabel() : 'None';
    return (
      <FormGroup>
        <Col componentClass={ControlLabel} md={2}>
          Payment Gateway
        </Col>
        <Col sm={7}>
          {label}
          <Button onClick={this.onChangePaymentGateway} bsSize="xsmall" style={{ marginLeft: 10, minWidth: 80 }}>
            <i className="fa fa-pencil" />
            &nbsp;{hasPaymentGateway ? 'Change' : 'Add'}
          </Button>
        </Col>
      </FormGroup>
    );
  }

  renderInCollection = () => {
    const { customer } = this.props;
    if (customer.get('in_collection', false) === true || customer.get('in_collection', 0) === 1) {
      const fromDate = moment(customer.get('in_collection_from', '')).format(globalSetting.dateFormat);
      return (<p className="danger-red">In collection from {fromDate}</p>);
    }
    return null;
  }

  renderSelectInput = (field) => {
    const { customer } = this.props;
    const fieldName = field.get('field_name');
    const options = field.get('select_options', '')
      .split(',')
      .map(val => ({
        field: field.get('field_name'),
        value: val,
        label: val,
      }));
    return (
      <Select id={fieldName} onChange={this.onSelect} options={options} value={customer.get(fieldName, '')} />
    );
  }

  renderField = (field, key) => {
    const { customer, onChange } = this.props;
    const fieldName = field.get('field_name');
    return (
      <FormGroup controlId={fieldName} key={key} >
        <Col componentClass={ControlLabel} md={2}>
          { field.get('title', fieldName) }
        </Col>
        <Col sm={7}>
          { field.get('select_list', false)
            ? this.renderSelectInput(field)
            : <Field onChange={onChange} id={fieldName} value={customer.get(fieldName, '')} />
          }
        </Col>
      </FormGroup>
    );
  }

  renderFields = () => {
    const { fields } = this.props;
    return fields
      .filter(this.filterPrinableFields)
      .map(this.renderField);
  }

  render() {
    const { customer, action } = this.props;
    // in update mode wait for item before render edit screen
    if (action === 'update' && typeof customer.getIn(['_id', '$id']) === 'undefined') {
      return (<div> <p>Loading...</p> </div>);
    }

    return (
      <div className="Customer">
        <Form horizontal>
          { this.renderFields() }
          { (action !== 'create') && this.renderChangePaymentGateway() }
        </Form>
        {(action !== 'create') &&
          <div>
            <hr />
            { this.renderInCollection() }
            <p>See Customer <Link to={`/usage?base={"aid": ${customer.get('aid')}}`}>Usage</Link></p>
            <p>See Customer <Link to={`/invoices?base={"aid": ${customer.get('aid')}}`}>Invoices</Link></p>
          </div>
        }
      </div>
    );
  }
}

export default connect()(Customer);
