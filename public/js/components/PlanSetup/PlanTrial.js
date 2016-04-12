import React, { Component } from 'react';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

export default class PlanTrial extends Component {
  constructor(props) {
    super(props);
    this.transaction_options = [{label: "Every Month", value: "every_month"}];
  }

  render() {
    let options = this.transaction_options.map((op, key) => {
      return (
        <option value={op.value} key={key}>{op.label}</option>
      );
    });

    return (
      <div>
        <h4>Trial</h4>
        <div className="form-group">
          <div className="row">
            <div className="col-xs-2">
              <label htmlFor="trial-transaction">*Transaction</label>
            </div>
            <div className="col-xs-1">
              <label htmlFor="trial-cycle">Cycle</label>
            </div>
            <div className="col-xs-2">
              <label htmlFor="plan-fee">Plan Fee</label>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-2">
              <select className="form-control" id="trial-transaction">
                {options}
              </select>
            </div>
            <div className="col-xs-1">
              <input type="number" className="form-control" id="trial-cycle" />
            </div>
            <div className="col-xs-2">
              <input type="number" className="form-control" id="plan-fee" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
