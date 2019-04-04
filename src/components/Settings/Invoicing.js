import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Form, FormGroup, Col, ControlLabel, HelpBlock } from 'react-bootstrap';
import Field from '@/components/Field';
import { SettingsDescription } from '../../language/FieldDescriptions';

export default class Invoicing extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    data: PropTypes.instanceOf(Immutable.Map),
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
            <Col componentClass={ControlLabel} sm={2}>
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
            <Col sm={10} smOffset={2} style={checkboxStyle}>
              <Field
                fieldType="checkbox"
                label="Billing cycle generates PDF invoices"
                value={data.get('generate_pdf', true)}
                onChange={this.onToggleGeneratePdf}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={10} smOffset={2} style={checkboxStyle}>
              <Field
                fieldType="checkbox"
                label="Detailed Invoices"
                value={data.get('detailed_invoices', false)}
                onChange={this.onToggleDetailedInvoices}
                disabled={!data.get('generate_pdf', true)}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={10} smOffset={2} style={checkboxStyle}>
              <Field
                fieldType="checkbox"
                label="Send invoices to customers by email"
                value={data.get('email_after_confirmation', false)}
                onChange={this.onToggleEmailAfterConfirmation}
                disabled={!data.get('generate_pdf', true)}
              />
            <HelpBlock style={{ marginLeft: 20, marginTop: 0 }}>
              {SettingsDescription.email_after_confirmation}
            </HelpBlock>
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}
