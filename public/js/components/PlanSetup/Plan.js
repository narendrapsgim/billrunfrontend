import React, { Component } from 'react';

import DateTimeField from '../react-bootstrap-datetimepicker/lib/DateTimeField';
import Field from '../Field';
import Help from '../Help';
import { PlanDescription } from '../../FieldDescriptions';
import FontIcon from 'material-ui/FontIcon';
import * as Colors from 'material-ui/styles/colors'

export default class Plan extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { plan,
          validator,
          onChangeFieldValue,
          onChangeRecurringPriceFieldValue,
          onCheckEndOfDays,
          onChangeDateFieldValue,
          onRemoveRecurringPrice,
          onAddTariff,
          mode } = this.props;

    /* TODO: Put into separate config file */
    let each_period_options = ["Month", "Year"].map((op, key) => (
      <option value={op} key={key}>{op}</option>
    ));

    return (
      <form className="form-horizontal BasicPlanSettings">
        <div className="BasicSettings">
          <div className="form-group">
            <div className="col-xs-6">
              <label htmlFor="PlanName">Name</label><Help contents={PlanDescription.name} />
              <Field id="PlanName" onChange={onChangeFieldValue} value={plan.get('PlanName')} required={true} disabled={mode === 'update'}/>
            </div>
            <div className="col-xs-6" >
              <label htmlFor="PlanCode">Code</label>
              <Field  id="PlanCode" value={plan.get('PlanCode')} onChange={onChangeFieldValue} />
            </div>
          </div>
          <div className="form-group">
            <div className="col-xs-12">
              <label htmlFor="PlanDescription">Description</label>
              <textarea id="PlanDescription" className="form-control" value={plan.get('PlanDescription')} onChange={onChangeFieldValue} />
            </div>
          </div>
          <div className="form-group">
            <div className="col-xs-4">
              <label htmlFor="Each">Frequency</label>
              <input type="number" id="Each" className="form-control" value={plan.get('Each')} onChange={onChangeFieldValue} />
            </div>
            <div className="col-xs-4">
              <label htmlFor="EachPeriod">&nbsp;</label>
              <select id="EachPeriod" className="form-control" value={plan.get('EachPeriod')} onChange={onChangeFieldValue}>
                { each_period_options }
              </select>
            </div>
            <div className="col-xs-4">
              <label>Charging Mode</label>
              <select id="ChargingMode" className="form-control" value={plan.get('ChargingMode')} onChange={onChangeFieldValue}>
                <option value="upfront">Upfront</option>
                <option value="arrears">Arrears</option>
              </select>
            </div>
          </div>
        </div>
        {/* <div className="form-group">
        <div className="col-xs-2">
        <label>Valid From</label>
        <DateTimeField id="from" value={plan.get('from')}  onChange={onChangeDateFieldValue.bind(this, "from")} />
        </div>
        <div className="col-xs-2">
        <label>To</label>
        <DateTimeField id="to"   value={plan.get('to')}    onChange={onChangeDateFieldValue.bind(this, "to")} />
        </div>
        </div> */}
        <div className="Trial" style={{marginTop: 20}}>
          <h4>Trial Period</h4>
          <div className="form-group">
            <div className="col-xs-4">
              <label htmlFor="TrialCycle">Cycles</label>
              <input type="number" id="TrialCycle" className="form-control" value={plan.get('TrialCycle')} onChange={onChangeFieldValue} />
            </div>
            <div className="col-xs-6">
              <label htmlFor="TrialPrice">Price</label>
              <Field id="TrialPrice" onChange={onChangeFieldValue} value={plan.get('TrialPrice')} />
            </div>
            <div className="col-xs-2"></div>
          </div>
        </div>
        <div className="PlanRecurring" style={{marginTop: 20}}>
          <h4>Recurring Charges</h4>
          <p className="help-block">Leave cycle blank for unlimited</p>
          { plan.get('recurring_prices').map((price, key) => (
              <div className="form-group" key={key}>
                <div className="col-xs-4">
                  <label htmlFor="Cycle">Cycles</label>
                  <input type="number" id="Cycle" className="form-control" min="0" value={price.get('Cycle')} onChange={onChangeRecurringPriceFieldValue.bind(this, "Cycle", key)} />
                </div>
                <div className="col-xs-6">
                  <label htmlFor="PeriodicalRate">Price</label>
                  <Field id="PeriodicalRate" onChange={onChangeRecurringPriceFieldValue.bind(this, "PeriodicalRate", key)} value={price.get('PeriodicalRate')} />
                </div>
                {  /* only show remove button if there is more than one interval and only for the last one */ }
                <div className="col-xs-1">
                  { (key === (plan.get('recurring_prices').size - 1)) &&
                    <i className="fa fa-plus-circle fa-lg" onClick={onAddTariff} style={{cursor: "pointer", color: 'green', marginTop: 35}} ></i>
                  }
                 </div>
                 <div className="col-xs-1">
                  { (key === (plan.get('recurring_prices').size - 1) && plan.get('recurring_prices').size > 1) &&
                    <i className="fa fa-minus-circle fa-lg" onClick={onRemoveRecurringPrice.bind(this, key)} style={{cursor: "pointer", color: 'red', marginTop: 35}} ></i>
                  }
                </div>
              </div>
          ))}
        </div>
      </form>
    );
  }
}
