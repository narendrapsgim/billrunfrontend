import React, { Component } from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import { Form, FormGroup, Col, InputGroup, FormControl, ControlLabel } from 'react-bootstrap';


export default class CurrencyTax extends Component {

  static defaultProps = {
    currencies: [
      { label: 'NIS ₪', val: 'NIS' },
      { label: 'USD $', val: 'USD' },
      { label: 'EUR €', val: 'EUR' },
      { label: 'AUD $', val: 'AUD' },
      { label: 'SRD $', val: 'SRD' },
    ],
  };

  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    data: React.PropTypes.instanceOf(Immutable.Map),
    currencies: React.PropTypes.arrayOf(React.PropTypes.object),
  };

  onChangeCurrency = (value) => {
    this.props.onChange('pricing', 'currency', value);
  }

  render() {
    const { data, currencies } = this.props;

    return (
      <div className="CurrencyTax">
        <Form horizontal>
          <FormGroup controlId="currency" key="currency">
            <Col componentClass={ControlLabel} md={2}>
              Currency
            </Col>
            <Col sm={6}>
              <Select options={currencies} value={data.get('currency', '')} onChange={this.onChangeCurrency} />
            </Col>
          </FormGroup>
          <FormGroup controlId="vat" key="vat">
            <Col componentClass={ControlLabel} md={2}>
              VAT
            </Col>
            <Col sm={6}>
              <InputGroup>
                <FormControl type="text" name="vat" onChange={this.onChange} value={data.get('vat', '')} />
                <InputGroup.Addon>%</InputGroup.Addon>
              </InputGroup>
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}
