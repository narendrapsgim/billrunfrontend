import React, { Component } from 'react';
import { connect } from 'react-redux';

import DatePicker from 'material-ui/DatePicker';

import Field from '../Field';

class Plan extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { basic_settings,
          onChangeFieldValue,
          onChangeDateFieldValue } = this.props;

    let transaction_options = ["Every Month", "Every Week"].map((op, key) => (
      <option value={op} key={key}>{op}</option>
    ));

    let each_period_options = ["Month", "Day"].map((op, key) => (
      <option value={op} key={key}>{op}</option>
    ));
    
    return (
      <div className="BasicPlanSettings">
        <div className="BasicSettings">
          <h4>Basic Settings</h4>
          <div className="row">
            <div className="col-md-4">
              <label for="PlanName">Plan Name</label>
              <Field id="PlanName" onChange={onChangeFieldValue.bind(this, "basic_settings")} value={basic_settings.PlanName} />
            </div>
            <div className="col-md-3" >
              <label for="PlanCode">Plan Code</label>
              <Field  id="PlanCode" value={basic_settings.PlanCode} onChange={onChangeFieldValue.bind(this, "basic_settings")} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-7">
              <label for="PlanDescription">Plan Description</label>
              <textarea id="PlanDescription" className="form-control" value={basic_settings.PlanDescription} onChange={onChangeFieldValue.bind(this, "basic_settings")} />
            </div>
          </div>
        </div>
        <div className="Trial">
          <h4>Trial</h4>
          <div className="row">
            <div className="col-xs-1">
              <label for="TrialCycle">Billing Cycles</label>
              <input type="number"  id="TrialCycle" className="form-control" value={basic_settings.TrialCycle} onChange={onChangeFieldValue.bind(this, "basic_settings")} />
            </div>
            <div className="col-xs-1">
              <label for="TrialPrice">Price</label>
              <Field id="TrialPrice" onChange={onChangeFieldValue.bind(this, "basic_settings")} value={basic_settings.TrialPrice} />
            </div>
          </div>
        </div>
        <div className="PlanRecurring">
          <h4>Plan Recurring</h4>
          <div className="row">
            <div className="col-xs-1">
              <label for="PeriodicalRate">Periodical Rate</label>
              <Field id="PeriodicalRate" onChange={onChangeFieldValue.bind(this, "basic_settings")} value={basic_settings.PeriodicalRate} />
            </div>
            <div className="col-xs-1">
              <label for="Each">Each</label>
              <input type="number" id="Each" className="form-control" value={basic_settings.Each} onChange={onChangeFieldValue.bind(this, "basic_settings")} />
            </div>
            <div className="col-xs-1">
              <label for="EachPeriod">&nbsp;</label>
              <select id="EachPeriod" className="form-control" value={basic_settings.EachPeriod} onChange={onChangeFieldValue.bind(this, "basic_settings")}>
                { each_period_options }
              </select>
            </div>
            <div className="col-xs-1">
              <label for="Cycle">Cycle</label>
              <input type="number" id="Cycle" className="form-control" value={basic_settings.Cycle} onChange={onChangeFieldValue.bind(this, "basic_settings")} />
            </div>
            <div className="col-xs-1">
              <Field id="From" onChange={onChangeFieldValue.bind(this, "basic_settings")} value={basic_settings.From} />
            </div>
            <div className="col-xs-1">
              <Field id="To" onChange={onChangeFieldValue.bind(this, "basic_settings")} value={basic_settings.To} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state, props) {
  return state.plan || {};
}

export default connect(mapStateToProps)(Plan);
