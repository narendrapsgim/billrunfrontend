import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';

export default connect()(class SelectDelimiter extends Component {
  constructor(props) {
    super(props);
  }

  onChangeDelimiter = (value) => {
    this.props.onChangeDelimiter({ target: { value } });
  }

  delimiterOptions = [
    { value: '	', label: 'Tab' }, // eslint-disable-line no-tabs
    { value: ' ', label: 'Space' },
    { value: ',', label: 'Comma (,)' },
  ];

  render() {
    const { settings,
            onSetDelimiterType } = this.props;

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
                <input type="radio" name="delimiter-type" style={{ verticalAlign: 'middle' }}
                       value="separator"
                       disabled={!settings.get('file_type', false)}
                       onChange={onSetDelimiterType}
                       checked={settings.get('delimiter_type', '') === "separator"} /><small>&nbsp;By delimiter</small>
              </div>
              <Select
                id="separator"
                className="delimiter-select"
                allowCreate
                disabled={!settings.get('file_type', '') || settings.get('delimiter_type', '') !== 'separator'}
                onChange={this.onChangeDelimiter}
                options={this.delimiterOptions}
                value={settings.get('delimiter', '')}
                placeholder="Select or type..."
                addLabelText="{label}"
              />
            </div>
          </div>
          <div className="col-lg-3" style={{marginTop: 10}}>
            <input type="radio" name="delimiter-type" style={{ verticalAlign: 'middle' }}
                   value="fixed"
                   disabled={!settings.get('file_type', false)}
                   onChange={onSetDelimiterType}
                   checked={settings.get('delimiter_type', '') === "fixed"} /><label htmlFor="delimiter-type">&nbsp;Fixed width</label>
          </div>
        </div>
      </div>

    );
  }
});
