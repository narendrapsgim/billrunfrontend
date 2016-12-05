import React, { Component } from 'react'
import { connect } from 'react-redux';

export default connect()(class SelectDelimiter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { settings,
            onSetDelimiterType,
            onChangeDelimiter } = this.props;

    return (
      <div className="form-group">
        <div className="col-lg-3">
          <label htmlFor="delimiter">Delimiter</label>
        </div>
        <div className="col-lg-9">
          <div className="col-lg-1" style={{marginTop: 8}}>
            <i className="fa fa-long-arrow-right"></i>
          </div>
          <div className="col-lg-5">
            <div className="input-group">
              <div className="input-group-addon">
                <input type="radio" name="delimiter-type"
                       value="separator"
                       disabled={!settings.get('file_type', false)}
                       onChange={onSetDelimiterType}
                       checked={settings.get('delimiter_type', '') === "separator"} />By delimiter
              </div>
              <input id="separator"
                     className="form-control"
                     type="text"
                     maxLength="1"
                     disabled={!settings.get('file_type', '') || settings.get('delimiter_type', '') !== "separator"}
                     style={{width: 35}}
                     onChange={onChangeDelimiter}
                     value={settings.get('delimiter', '')} />
            </div>
          </div>
          <div className="col-lg-3" style={{marginTop: 10}}>
            <input type="radio" name="delimiter-type"
                   value="fixed"
                   disabled={!settings.get('file_type', false)}
                   onChange={onSetDelimiterType}
                   checked={settings.get('delimiter_type', '') === "fixed"} />Fixed width
          </div>
        </div>
      </div>

    );
  }
});
