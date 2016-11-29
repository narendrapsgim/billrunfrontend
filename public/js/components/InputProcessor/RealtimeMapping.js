import React from 'react';
import { connect } from 'react-redux';

const RealtimeMapping = (props) => {
  const { onChange } = props;

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
                <select className="form-control">
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
