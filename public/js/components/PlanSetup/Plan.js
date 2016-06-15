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
      onChangeSelectFieldValue,
      onChangeDateFieldValue } = this.props;

    let transaction_options = ["Every Month", "Every Week"].map((op, key) => (
      <MenuItem value={op} primaryText={op} key={key} />
    ));

    let each_period_options = ["Month", "Day"].map((op, key) => (
      <MenuItem value={op} primaryText={op} key={key} />
    ));
    
    return (
      <div className="BasicPlanSettings">
        <div className="BasicSettings">
          <h4>Basic Settings</h4>
          <div className="row">
            <div className="col-xs-6">
              <div className="box">
                <TextField id="PlanName"
                           value={basic_settings.PlanName}
                           onChange={onChangeFieldValue.bind(this, "basic_settings")}
                           floatingLabelText="Plan Name"
                />
              </div>
            </div>
            <div className="col-xs-4" >
              <div className="box">
                <TextField id="PlanCode"
                           value={basic_settings.PlanCode}
                           onChange={onChangeFieldValue.bind(this, "basic_settings")}
                           floatingLabelText="Plan Code"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <div className="box">
                <TextField id="PlanDescription"
                           value={basic_settings.PlanDescription}
                           onChange={onChangeFieldValue.bind(this, "basic_settings")}
                           floatingLabelText="Plan Description"
                           multiLine={true}
                           rows={3}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="Trial">
          <h4>Trial</h4>
          <div className="row">
            <div className="col-xs-3">
              <div className="box">
                <SelectField
                    value={basic_settings.TrialTransaction}
                    id="TrialTransaction"
                    floatingLabelText="*Transaction"
                    onChange={onChangeSelectFieldValue.bind(this, "basic_settings", "TrialTransaction")}>
                  { transaction_options }
                </SelectField>
              </div>
            </div>
            <div className="col-xs-3">
              <div className="box">
                <TextField id="PlanFee"
                           type="number"
                           value={basic_settings.PlanFee}
                           onChange={onChangeFieldValue.bind(this, "basic_settings")}
                           floatingLabelText="Plan Fee"
                />
              </div>
            </div>
            <div className="col-xs-3">
              <div className="box">
                <TextField id="TrialCycle"
                           type="number"
                           value={basic_settings.TrialCycle}
                           onChange={onChangeFieldValue.bind(this, "basic_settings")}
                           floatingLabelText="Cycle"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="PlanRecurring">
          <h4>Plan Recurring</h4>
          <div className="row">
            <div className="col-xs-3">
              <div className="box">
                <TextField id="PeriodicalRate"
                           value={basic_settings.PeriodicalRate}
                           onChange={onChangeFieldValue.bind(this, "basic_settings")}
                           floatingLabelText="Periodical Rate"
                />
              </div>
            </div>
            <div className="col-xs-3">
              <div className="box">
                <TextField id="Each"
                           value={basic_settings.Each}
                           onChange={onChangeFieldValue.bind(this, "basic_settings")}
                           floatingLabelText="Each"
                           type="number"
                />
              </div>
            </div>
            <div className="col-xs-3">
              <div className="box">
                <SelectField id="EachPeriod"
                             value={basic_settings.EachPeriod}
                             onChange={onChangeSelectFieldValue.bind(this, "basic_settings", "EachPeriod")}
                >
                  { each_period_options }
                </SelectField>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-3">
              <div className="box">
                <TextField id="Cycle"
                           value={basic_settings.Cycle}
                           onChange={onChangeFieldValue.bind(this, "basic_settings")}
                           floatingLabelText="Cycle"
                           type="number"
                />
              </div>
            </div>
            <div className="col-xs-3">
              <div className="box">
                <DatePicker id="From"
                            hintText="From"
                            value={basic_settings.From}
                            onChange={onChangeDateFieldValue.bind(this, "basic_settings", "From")}
                />
              </div>
            </div>
            <div className="col-xs-3">
              <div className="box">
                <DatePicker id="To"
                            hintText="To"
                            value={basic_settings.To}
                            onChange={onChangeDateFieldValue.bind(this, "basic_settings", "To")}
                />
              </div>
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
