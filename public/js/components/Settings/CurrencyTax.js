import React, { Component } from 'react';
import Immutable from 'immutable';
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

  onChange = (e) => {
    const { id, value } = e.target;
    this.props.onChange('pricing', id, value);
  }

  renderOption = (curr, key) => <option value={curr.val} key={key}>{curr.label}</option>;

  render() {
    const { data, currencies } = this.props;
    const currencyOptions = currencies.map(this.renderOption);

    return (
      <div className="CurrencyTax">
        <Form horizontal>
          <FormGroup controlId="currency" key="currency">
            <Col componentClass={ControlLabel} md={2}>
              Currency
            </Col>
            <Col sm={6}>
              <select className="form-control" id="currency" value={data.get('currency', '')} onChange={this.onChange}>
                { currencyOptions }
              </select>
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
