import React, { Component } from 'react';
import { connect } from 'react-redux';

import TextField   from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem    from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';

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
          <form className="form-inline">
            <div className="form-group">
              <div className="row">
                <div className="col-md-4">
                  <label for="PlanName">Plan Name</label>
                  <input type="text" id="PlanName"  className="form-control" value={basic_settings.PlanName} onChange={onChangeFieldValue.bind(this, "basic_settings")} />
                </div>
                <div className="col-md-3" >
                  <label for="PlanCode">Plan Code</label>
                  <input type="text"  id="PlanCode" className="form-control" value={basic_settings.PlanCode} onChange={onChangeFieldValue.bind(this, "basic_settings")} />
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
                  <input type="number"  id="TrialPrice" className="form-control" value={basic_settings.TrialPrice} onChange={onChangeFieldValue.bind(this, "basic_settings")} />
                </div>
              </div>
            </div>
            <div className="PlanRecurring">
              <h4>Plan Recurring</h4>
              <div className="row">
                <div className="col-xs-1">
                  <label for="PeriodicalRate">Periodical Rate</label>
                  <input type="text" id="PeriodicalRate" className="form-control" value={basic_settings.PeriodicalRate} onChange={onChangeFieldValue.bind(this, "basic_settings")} />
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
                  <DatePicker id="From"
                              hintText="From"
                              fullWidth={true}
                              value={basic_settings.From}
                              textFieldStyle={{height: "72px"}}
                              onChange={onChangeDateFieldValue.bind(this, "basic_settings", "From")}
                  />
                </div>
                <div className="col-xs-1">
                  <DatePicker id="To"
                              fullWidth={true}                            
                              hintText="To"
                              textFieldStyle={{height: "72px"}}
                              value={basic_settings.To}
                              onChange={onChangeDateFieldValue.bind(this, "basic_settings", "To")}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state, props) {
  return state.plan || {};
}

export default connect(mapStateToProps)(Plan);
