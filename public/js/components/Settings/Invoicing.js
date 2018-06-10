import React, { Component } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import Field from '../Field';
import Help from '../Help';
import { SettingsDescription } from '../../FieldDescriptions';

export default class Invoicing extends Component {

  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    data: React.PropTypes.instanceOf(Immutable.Map),
  };

  onChange = (e) => {
    const { id, value } = e.target;
    this.props.onChange('billrun', id, value);
  }

  onToggleDetailedInvoices = (e) => {
    const { value } = e.target;
    this.props.onChange('billrun', 'detailed_invoices', value);
  }

  onToggleEmailAfterConfirmation = (e) => {
    const { value } = e.target;
    this.props.onChange('billrun', 'email_after_confirmation', value);
  }

  onToggleGeneratePdf = (e) => {
    const { value } = e.target;
    this.props.onChange('billrun', 'generate_pdf', value);
  }

  renderOption = (value, key) => <option value={value} key={key}>{value}</option>;

  render() {
    const { data } = this.props;
    const checkboxStyle = { marginTop: 10 };
    const billingDayOptions = [...Array(28)].map((_, i) => this.renderOption((i + 1), i));

    return (
      <div className="Invoicing">
        <Form horizontal>
          <FormGroup controlId="charging_day" key="charging_day">
            <Col componentClass={ControlLabel} md={2}>
              Charging Day
            </Col>
            <Col sm={6}>
              <select id="charging_day" name="charging_day" value={data.get('charging_day', '')} onChange={this.onChange} className="form-control">
                {[
                  <option value="" key="select_charging_day">Select charging day...</option>,
                  ...billingDayOptions,
                ]}
              </select>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>
              Billing cycle generates PDF invoices
            </Col>
            <Col sm={6} style={checkboxStyle}>
              <Field fieldType="checkbox" value={data.get('generate_pdf', true)} onChange={this.onToggleGeneratePdf} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>
              Detailed Invoices
            </Col>
            <Col sm={6} style={checkboxStyle}>
              <Field fieldType="checkbox" value={data.get('detailed_invoices', false)} onChange={this.onToggleDetailedInvoices} disabled={!data.get('generate_pdf', true)} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>
              Send invoices to customers by email
              &nbsp;<Help contents={SettingsDescription.email_after_confirmation} />
            </Col>
            <Col sm={6} style={checkboxStyle}>
              <Field fieldType="checkbox" value={data.get('email_after_confirmation', false)} onChange={this.onToggleEmailAfterConfirmation} disabled={!data.get('generate_pdf', true)} />
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}
