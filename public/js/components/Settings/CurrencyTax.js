import React, { Component } from 'react';

export default class CurrencyTax extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { onChange, data } = this.props;

    let currency_options = [{label: "USD$", val: "$"}, {label: "EUR€", val: "€"}].map((curr, key) => (
      <option value={curr.val} key={key}>{curr.label}</option>
    ));

    return (
      <div className="CurrencyTaxSettings contents"
           style={{border: "1px solid #C0C0C0", padding: "45px"}}>
        <div className="Currency">
          <div className="row">
            <div className="col-md-1">
              <label for="currency">Currency</label>
              <select className="form-control"
                      id="currency"
                      value={data.get('currency')}
                      onChange={onChange}>
                { currency_options }
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
