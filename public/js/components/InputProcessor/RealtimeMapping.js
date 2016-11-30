import React from 'react';
import { connect } from 'react-redux';

const RealtimeMapping = (props) => {
  const { onChange, settings } = props;

  const available_fields = [(<option disabled value="" key={-1}>Select Field</option>),
                            ...settings.get('fields', []).map((field, key) => (
                              <option value={field} key={key}>{field}</option>
                            ))];  
  
  return (
    <div className="RealtimeMapping">
      <form className="form-horizontal CalculatorMapping">

        <div className="form-group">
          <div className="col-lg-3">
            <label htmlFor="type_field">Request type field</label>
            <p className="help-block"></p>
          </div>
          <div className="col-lg-9">
            <div className="col-lg-1" style={{marginTop: 8}}>
              <i className="fa fa-long-arrow-right"></i>
            </div>
            <div className="col-lg-9">
              <div className="col-lg-6">
                <select
                    id="requestType"
                    className="form-control"
                    value={settings.getIn(['response', 'fields', 'requestType'], '')}>
                  { available_fields }
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="col-lg-3">
            <label htmlFor="">Request type pretend field</label>
            <p className="help-block"></p>
          </div>
          <div className="col-lg-9">
            <div className="col-lg-1" style={{marginTop: 8}}>
              <i className="fa fa-long-arrow-right"></i>
            </div>
            <div className="col-lg-9">
              <div className="col-lg-6">
                <select
                    id=""
                    className="form-control"
                    value={settings.getIn(['response', 'fields', 'requestType'], '')}>
                  { available_fields }>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="col-lg-3">
            <label htmlFor="">Rebalance field</label>
            <p className="help-block"></p>
          </div>
          <div className="col-lg-9">
            <div className="col-lg-1" style={{marginTop: 8}}>
              <i className="fa fa-long-arrow-right"></i>
            </div>
            <div className="col-lg-9">
              <div className="col-lg-6">
                <select
                    id=""
                    className="form-control"
                    value={settings.getIn(['response', 'fields', 'requestType'], '')}>
                  { available_fields }>
                </select>
              </div>
            </div>
          </div>
        </div>


        <div className="form-group">
          <div className="col-lg-3">
            <label htmlFor="">Reference field</label>
            <p className="help-block"></p>
          </div>
          <div className="col-lg-9">
            <div className="col-lg-1" style={{marginTop: 8}}>
              <i className="fa fa-long-arrow-right"></i>
            </div>
            <div className="col-lg-9">
              <div className="col-lg-6">
                <select className="form-control">
                </select>
              </div>
            </div>
          </div>
        </div>
        
      </form>
    </div>
  );
}

export default connect()(RealtimeMapping);
