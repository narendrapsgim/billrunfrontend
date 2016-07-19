import React, { Component } from 'react';
import moment from 'moment-timezone';

export default class DateTime extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { onChange, data } = this.props;

    let date_format_options = ["dd-mm-yy", "mm-dd-yy"].map((format, key) => (
      <option value={format} key={key}>{format}</option>
    ));
    let time_format_options = ["12-hour", "24-hour"].map((format, key) => (
      <option value={format} key={key}>{format}</option>
    ));
    let time_zone_options = moment.tz.names().map((zone, key) => (
      <option value={zone} key={key}>{zone}</option>
    ));

    return (
      <div className="DateTimeSettings bordered-container" style={{padding: "45px"}}>
        <div className="row">
          <div className="col-md-2">
            <label for="date_format">Date Format</label>
            <select id="date_format" value={data.get('date_format')}
                    onChange={onChange} className="form-control">
              { date_format_options }
            </select>
          </div>
          <div className="col-md-2 col-md-offset-2">
            <label for="time_format">Time Format</label>
            <select id="time_format" value={data.get('time_format')}
                    onChange={onChange} className="form-control">
              { time_format_options }
            </select>
          </div>
          <div className="col-md-2 col-md-offset-2">
            <label for="time_zone">Time Zone</label>
            <select id="time_zone" value={data.get('time_zone')}
                    onChange={onChange} className="form-control">
              { time_zone_options }
            </select>
          </div>
        </div>
      </div>
    );
  }
}
