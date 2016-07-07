import React, { Component } from 'react';
import { connect } from 'react-redux';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Toggle from 'material-ui/Toggle';
import DatePicker from 'material-ui/DatePicker';

import Field from '../Field';

export default class Plan extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let { basicSettings,
          onChangeFieldValue,
          onChangeRecurringPriceFieldValue,
          onChangeRecurringPriceCheckFieldValue,
          onCheckEndOfDays,
          onChangeDateFieldValue,
          onAddTariff } = this.props;

    let transaction_options = ["Every Month", "Every Week"].map((op, key) => (
      <option value={op} key={key}>{op}</option>
    ));

    /* TODO: Put into separate config file */
    let each_period_options = ["Week", "Month", "Quarter", "Year"].map((op, key) => (
      <option value={op} key={key}>{op}</option>
    ));

    return (
      <div className="BasicPlanSettings">
        <div className="BasicSettings">
          <h4>Basic Settings</h4>
          <div className="row">
            <div className="col-md-4">
              <label for="PlanName">Plan Name</label>
              <Field id="PlanName" onChange={onChangeFieldValue.bind(this, "basicSettings")} value={basicSettings.PlanName} />
            </div>
            <div className="col-md-3" >
              <label for="PlanCode">Plan Code</label>
              <Field  id="PlanCode" value={basicSettings.PlanCode} onChange={onChangeFieldValue.bind(this, "basicSettings")} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-7">
              <label for="PlanDescription">Plan Description</label>
              <textarea id="PlanDescription" className="form-control" value={basicSettings.PlanDescription} onChange={onChangeFieldValue.bind(this, "basicSettings")} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-1">
              <label for="Each">Each</label>
              <input type="number" id="Each" className="form-control" value={basicSettings.Each} onChange={onChangeFieldValue.bind(this, "basicSettings")} />
            </div>
            <div className="col-xs-1">
              <label for="EachPeriod">&nbsp;</label>
              <select id="EachPeriod" className="form-control" value={basicSettings.EachPeriod} onChange={onChangeFieldValue.bind(this, "basicSettings")}>
                { each_period_options }
              </select>
            </div>
          </div>
        </div>
        <div className="Trial">
          <h4>Trial</h4>
          <div className="row">
            <div className="col-xs-1">
              <label for="TrialPrice">Price</label>
              <Field id="TrialPrice" onChange={onChangeFieldValue.bind(this, "basicSettings")} value={basicSettings.TrialPrice} />
            </div>
            <div className="col-xs-1">
              <label for="TrialCycle">Billing Cycles</label>
              <input type="number"  id="TrialCycle" className="form-control" value={basicSettings.TrialCycle} onChange={onChangeFieldValue.bind(this, "basicSettings")} />
            </div>
          </div>
        </div>
        <div className="PlanRecurring">
          <h4>Plan Recurring</h4>
          { basicSettings.recurring_prices.map((price, key) => (
              <div className="row" key={key}>
                <div className="col-xs-1">
                  <label for="PeriodicalRate">Tariff</label>
                  <Field id="PeriodicalRate" onChange={onChangeRecurringPriceFieldValue.bind(this, "PeriodicalRate", key)} value={price.PeriodicalRate} />
                </div>
                <div className="col-xs-1">
                  <label for="Cycle"># of Cycles</label>
                  <input type="number" id="Cycle" className="form-control" min="0" value={price.Cycle} onChange={onChangeRecurringPriceFieldValue.bind(this, "Cycle", key)} disabled={price.EndOfDays} />
                </div>
                {(() => {  /* only show "end of days" toggle for last price */
                   if (key === (basicSettings.recurring_prices.length - 1)) {
                     return (
                       <div className="col-xs-3">
                         <div className="checkbox">
                           <label>
                             <input type="checkbox"
                                    defaultValue={price.EndOfDays}
                                    checked={price.EndOfDays}
                                    id="EndOfDays"
                                    onChange={onChangeRecurringPriceCheckFieldValue.bind(this, "EndOfDays", key)} />
                             Till the End of Days
                           </label>
                         </div>
                       </div>
                     )}})()}
              </div>
          ))}
          <div className="row">
            <div className="col-xs-3">
              <FloatingActionButton mini={true} style={{margin: "20px"}} onMouseUp={onAddTariff}>
                <ContentAdd />
              </FloatingActionButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
