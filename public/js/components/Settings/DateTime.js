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
            {/* <div className="col-lg-2">
            <label htmlFor="date_format">Date Format</label>
            <select id="date_format" value={data.get('date_format')}
            onChange={onChange} className="form-control">
            { date_format_options }
            </select>
            </div> */}
            {/* <div className="col-lg-2">
            <label htmlFor="time_format">Time Format</label>
            <select id="time_format" value={data.get('time_format')}
            onChange={onChange} className="form-control">
            { time_format_options }
            </select>
            </div> */}
            <div className="col-lg-2">
              <label htmlFor="time_zone">Time Zone</label>
              <select id="timezone" defaultValue={moment.tz.guess()} value={data.get('timezone')}
                      onChange={onChange} className="form-control">
                { time_zone_options }
              </select>
            </div>
          </div>
          <div className="form-group">
            <div className="col-lg-2">
              <label htmlFor="charging_day">Charging Day</label>
              <select id="charging_day" value={data.get('charging_day')}
                      onChange={onChange}
                      className="form-control">
                { billing_day_options }
              </select>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
