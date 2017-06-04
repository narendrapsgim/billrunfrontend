import React, { Component } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import Field from '../Field';

export default class ChargingDay extends Component {

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

  renderOption = (value, key) => <option value={value} key={key}>{value}</option>;

  render() {
    const { data } = this.props;
    const checkboxStyle = { marginTop: 10 };
    const billingDayOptions = [...Array(28)].map((_, i) => this.renderOption((i + 1), i));

    return (
      <div className="DateTime">
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
              Detailed Invoices
            </Col>
            <Col sm={6} style={checkboxStyle}>
              <Field fieldType="checkbox" value={data.get('detailed_invoices', false)} onChange={this.onToggleDetailedInvoices} />
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}
