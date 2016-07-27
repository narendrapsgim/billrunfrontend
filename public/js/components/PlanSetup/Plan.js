import React, { Component } from 'react';

import DateTimeField from '../react-bootstrap-datetimepicker/lib/DateTimeField';
import Field from '../Field';

export default class Plan extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let { plan,
          onChangeFieldValue,
          onChangeRecurringPriceFieldValue,
          onCheckEndOfDays,
          onChangeDateFieldValue,
          onAddTariff } = this.props;

    let transaction_options = ["Every Month", "Every Week"].map((op, key) => (
      <option value={op} key={key}>{op}</option>
    ));

    /* TODO: Put into separate config file */
    let each_period_options = ["Week", "Month", "Year"].map((op, key) => (
      <option value={op} key={key}>{op}</option>
    ));

    return (
      <div className="BasicPlanSettings">
        <div className="BasicSettings">
          <h4>Basic Settings</h4>
          <div className="row">
            <div className="col-md-4">
              <label htmlFor="PlanName">Name</label>
              <Field id="PlanName" onChange={onChangeFieldValue} value={plan.get('PlanName')} required={true} />
            </div>
            <div className="col-md-3" >
              <label htmlFor="PlanCode">Code</label>
              <Field  id="PlanCode" value={plan.get('PlanCode')} onChange={onChangeFieldValue} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-7">
              <label htmlFor="PlanDescription">Description</label>
              <textarea id="PlanDescription" className="form-control" value={plan.get('PlanDescription')} onChange={onChangeFieldValue} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-2">
              <label htmlFor="Each">Billing Frequency</label>
              <input type="number" id="Each" className="form-control" value={plan.get('Each')} onChange={onChangeFieldValue} />
            </div>
            <div className="col-md-1">
              <label htmlFor="EachPeriod">&nbsp;</label>
              <select id="EachPeriod" className="form-control" value={plan.get('EachPeriod')} onChange={onChangeFieldValue}>
                { each_period_options }
              </select>
            </div>
            <div className="col-md-2">
              <label>Charging Mode</label>
              <select id="ChargingMode" className="form-control" value={plan.get('ChargingMode')} onChange={onChangeFieldValue}>
                <option value="upfront">Upfront</option>
                <option value="arrears">Arrears</option>
              </select>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-2">
            <label>Valid From</label>
            <DateTimeField id="from" value={plan.get('from')}  onChange={onChangeDateFieldValue.bind(this, "from")} />
          </div>
          <div className="col-md-2">
            <label>To</label>
            <DateTimeField id="to"   value={plan.get('to')}    onChange={onChangeDateFieldValue.bind(this, "to")} />
          </div>
        </div>
        <div className="Trial" style={{marginTop: 20}}>
          <h4>Trial Period</h4>
          <div className="row">
            <div className="col-md-2">
              <label htmlFor="TrialCycle">Number of Cycles</label>
              <input type="number" id="TrialCycle" className="form-control" value={plan.get('TrialCycle')} onChange={onChangeFieldValue} />
            </div>
            <div className="col-md-1">
              <label htmlFor="TrialPrice">Price</label>
              <Field id="TrialPrice" onChange={onChangeFieldValue} value={plan.get('TrialPrice')} />
            </div>
          </div>
        </div>
        <div className="PlanRecurring" style={{marginTop: 20}}>
          <h4>Recurring Charges</h4>
          { plan.get('recurring_prices').map((price, key) => (
              <div className="row" key={key}>
                <div className="col-md-2">
                  <label htmlFor="Cycle">Number of Cycles</label>
                  <input type="number" id="Cycle" className="form-control" min="0" value={price.get('Cycle')} onChange={onChangeRecurringPriceFieldValue.bind(this, "Cycle", key)} />
                </div>
                <div className="col-xs-1">
                  <label htmlFor="PeriodicalRate">Price</label>
                  <Field id="PeriodicalRate" onChange={onChangeRecurringPriceFieldValue.bind(this, "PeriodicalRate", key)} value={price.get('PeriodicalRate')} />
                </div>
              </div>
          ))}
          <div className="row">
            <div className="col-xs-3">
              <button className="btn btn-primary" onClick={onAddTariff} style={{marginTop: 10}}>Add Charges</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
