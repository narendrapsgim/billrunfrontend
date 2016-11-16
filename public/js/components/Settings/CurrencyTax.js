import React, { Component } from 'react';
import Immutable from 'immutable';

export default class CurrencyTax extends Component {

  static defaultProps = {
    currencies: [
      { label: 'NIS ₪', val: 'NIS' },
      { label: 'USD $', val: 'USD' },
      { label: 'EUR €', val: 'EUR' },
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
      <div>
        <form className="form-horizontal CurrencyTaxSettings">
          <div className="form-group">
            <div className="col-md-12">
              <div className="col-md-3 control-label">
                <label htmlFor="currency">Currency</label>
              </div>
              <div className="col-md-4">
                <select
                  className="form-control"
                  id="currency"
                  value={data.get('currency', '')}
                  onChange={this.onChange}
                >
                  { currencyOptions }
                </select>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="col-md-12">
              <div className="col-md-3 control-label">
                <label htmlFor="vat">VAT</label>
              </div>
              <div className="col-md-4">
                <div className="input-group">
                  <input
                    id="vat"
                    type="number"
                    onChange={this.onChange}
                    value={data.get('vat', '')}
                    className="form-control"
                  />
                  <span className="input-group-addon">%</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
