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
      <div className="bordered-container"
           style={{padding: "45px"}}>
        <form className="form-horizontal CurrencyTaxSettings">
          <div className="form-group">
            <div className="col-xs-1">
              <label htmlFor="currency">Currency</label>
              <select className="form-control"
                      id="currency"
                      value={data.get('currency')}
                      onChange={onChange}>
                { currency_options }
              </select>
            </div>
          </div>
          <div className="form-group">
            <div className="col-xs-1">
              <label htmlFor="vat">VAT</label>
              <div className="input-group">
                <input id="vat" type="number" onChange={onChange} value={data.get('vat')} className="form-control" />
                <span className="input-group-addon">%</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
