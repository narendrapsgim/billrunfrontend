import React, { Component } from 'react';
import Help from '../Help';
import Toggle from 'material-ui/lib/toggle';
import DatePicker from 'material-ui/lib/date-picker/date-picker';

export default class PlanRecurring extends Component {
  constructor(props) {
    super(props);
    this.state = {disabled: true};
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.helpContents = `Plan Recurring yo!`;
    this.transaction_options = [{label: "Every Month", value: "every_month"}];
  }

  handleCheckbox(evt) {
    this.setState({disabled: !evt.target.checked});
  }
  
  render() {
    let options = this.transaction_options.map((op, key) => {
      return (
        <option value={op.value} key={key}>{op.label}</option>
      );
    });

    let datepickerStyle = {
      width: "170px"
    };
    
    return (
      <div>
        <Toggle
            label={<span>Plan Recurring</span>}
            labelPosition="right"
            labelStyle={{fontSize: "24px", fontWeight: "normal"}}
            onToggle={this.handleCheckbox} />
        <Help contents={this.helpContents} />
        <div className="row">
          <div className="col-xs-2">
            <label htmlFor="periodical-rate">Periodical Rate</label>
          </div>
          <div className="col-xs-1">
            <label htmlFor="each">Each</label>
          </div>
          <div className="col-xs-2"></div>
          <div className="col-xs-1">
            <label htmlFor="cycle">Cycle</label>
          </div>
          <div className="col-xs-2">
            <label htmlFor="validity">Validity</label>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-2">
            <input type="number" className="form-control" id="periodical-rate" disabled={this.state.disabled} />
          </div>
          <div className="col-xs-1">
            <input type="number" className="form-control" id="each" disabled={this.state.disabled} />
          </div>
          <div className="col-xs-2">
            <select className="form-control" id="trial-transaction" disabled={this.state.disabled}>
              {options}
            </select>
          </div>
          <div className="col-xs-1">
            <input type="number" className="form-control" id="cycle" disabled={this.state.disabled} />
          </div>
          <div className="col-xs-3">
            <DatePicker hintText="From" disabled={this.state.disabled} />
          </div>
          <div className="col-xs-3">
            <DatePicker hintText="To" disabled={this.state.disabled} />
          </div>
        </div>
      </div>
    );
  }
}
