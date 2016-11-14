import React, { Component } from 'react';
import moment from 'moment-timezone';
import Immutable from 'immutable';

export default class DateTime extends Component {

  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    data: React.PropTypes.instanceOf(Immutable.Map),
  };

  onChange = (e) => {
    const { id, value } = e.target;
    this.props.onChange('billrun', id, value);
  }

  renderOption = (value, key) => <option value={value} key={key}>{value}</option>;

  render() {
    const { data } = this.props;

    // const dateFormatOptions = ['dd-mm-yy', 'mm-dd-yy'].map(this.renderOption);
    // const timeFormatOptions = ['12-hour', '24-hour'].map(this.renderOption);
    const timeZoneOptions = moment.tz.names().map(this.renderOption);
    const billingDayOptions = _.times(28, n => this.renderOption((n + 1), n));
    const timezone = data.get('timezone', '').length !== 0 ? data.get('timezone', '') : moment.tz.guess();

    return (
      <div>
        <form className="form-horizontal">
          <div className="form-group">
            <div className="col-md-12">
              <div className="col-md-3 control-label">
                <label htmlFor="time_zone">Time Zone</label>
              </div>
              <div className="col-md-4">
                <select id="timezone" value={timezone} onChange={this.onChange} className="form-control">
                  { timeZoneOptions }
                </select>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="col-md-12">
              <div className="col-md-3 control-label">
                <label htmlFor="charging_day">Charging Day</label>
              </div>
              <div className="col-md-4">
                <select id="charging_day" value={data.get('charging_day', '')} onChange={this.onChange} className="form-control">
                  {[
                    <option value="" key="select_charging_day">Select charging day...</option>,
                    ...billingDayOptions,
                  ]}
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
