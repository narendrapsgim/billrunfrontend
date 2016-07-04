import React, { Component } from 'react';
import { connect } from 'react-redux';

class CalculatorMapping extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { settings,
            onSetCustomerMapping,
            onSetRating } = this.props;
    const available_fields = [(<option disabled value="-1" key={-1}>Select Field</option>),
                              ...settings.get('fields').map((field, key) => (
                                <option value={field} key={key}>{field}</option>
                              ))];
    const available_target_fields = [(<option disabled value="-1" key={-1}>Select Field</option>),
                                     ...["imsi", "sid", "aid"].map((field, key) => (
                                       <option value={field} key={key}>{field}</option>
                                     ))];
    const available_usagetypes = settings.getIn(['processor', 'usaget_mapping']).map(usaget => {
      return usaget.get('usaget');
    });

    return (
      <div className="CalculatorMapping">
        <div className="row">
          <div className="col-md-3">
            <label>Customer field</label>
          </div>
          <div className="col-md-3">
            <select id="src_key" className="form-control" onChange={onSetCustomerMapping} value={settings.getIn(['customer_identification_fields', 0, 'src_key'])} defaultValue="-1">
              { available_fields }
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
          </div>
          <div className="col-md-3">
            <select id="target_key" className="form-control" onChange={onSetCustomerMapping} value={settings.getIn(['customer_identification_fields', 0, 'target_key'])} defaultValue="-1">
              { available_target_fields }
            </select>
          </div>
        </div>
        {
          available_usagetypes.map((usaget, key) => (
            <div key={key}>
              <div className="row">
                <div className="col-md-3">
                  <h4>{usaget}</h4>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <input type="radio" name={`${usaget}-type`} value="match" data-usaget={usaget} data-rate_key="key" onChange={onSetRating} />By rate key
                  <input type="radio" name={`${usaget}-type`} value="longestPrefix" data-usaget={usaget} data-rate_key="params.prefix" onChange={onSetRating} />By longest prefix
                </div>
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {settings: state.inputProcessor};
}

export default connect(mapStateToProps)(CalculatorMapping);
