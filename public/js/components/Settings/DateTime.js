import React, { Component } from 'react';
import moment from 'moment-timezone';

export default class DateTime extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { onChange, data } = this.props;

    const date_format_options = ["dd-mm-yy", "mm-dd-yy"].map((format, key) => (
      <option value={format} key={key}>{format}</option>
    ));
    const time_format_options = ["12-hour", "24-hour"].map((format, key) => (
      <option value={format} key={key}>{format}</option>
    ));
    const time_zone_options = moment.tz.names().map((zone, key) => (
      <option value={zone} key={key}>{zone}</option>
    ));
    const billing_day_options = _.times(28, n => (
      <option value={n + 1} key={n}>{n + 1}</option>
    ));
    
    return (
      <div>
        <form className="form-horizontal">
          <div className="form-group">
            <div className="col-md-12">
              <div className="col-md-3 control-label">
                <label htmlFor="time_zone">Time Zone</label>
              </div>
              <div className="col-md-4">
                <select id="timezone" defaultValue={moment.tz.guess()} value={data.get('timezone')}
                        onChange={onChange} className="form-control">
                  { time_zone_options }
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
                <select id="charging_day" value={data.get('charging_day')}
                        onChange={onChange}
                        className="form-control">
                  { billing_day_options }
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
