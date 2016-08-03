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
      <div className="CurrencyTaxSettings">
        <div className="bordered-container"
             style={{padding: "45px"}}>
          <div className="Currency">
            <div className="row">
              <div className="col-xs-1">
                <label htmlFor="currency">Currency</label>
                <select className="form-control"
                        id="currency"
                        value={data.get('currency')}
                        onChange={onChange}>
                  { currency_options }
                </select>
              </div>
              <div className="col-xs-1">
                <label htmlFor="tax">Tax</label>
                <input type="number" id="tax" onChange={onChange} value={data.get('tax')} className="form-control" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
