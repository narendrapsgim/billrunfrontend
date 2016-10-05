import React, { Component } from 'react';
import { connect } from 'react-redux';

export default class CalculatorMapping extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { settings,
            onSetCustomerMapping,
            onSetLineKey,
            onSetRating } = this.props;
    const available_fields = [(<option disabled value="-1" key={-1}>Select Field</option>),
                              ...settings.get('fields').map((field, key) => (
                                <option value={field} key={key}>{field}</option>
                              ))];
    const available_target_fields = [(<option disabled value="-1" key={-1}>Select Field</option>),
                                     ...["sid", "aid"].map((field, key) => (
                                       <option value={field} key={key}>{field}</option>
                                     ))];
    const available_usagetypes = settings.get('rate_calculators').keySeq().map(usaget => {
      return usaget;
    });

    return (
      <form className="form-horizontal CalculatorMapping">
        <div className="form-group">
          <div className="col-lg-3">
            <label htmlFor="src_key">Customer identification</label>
            <p className="help-block">Map customer identification field in record to Billrun field</p>
          </div>
          <div className="col-lg-9">
            <div className="col-lg-1" style={{marginTop: 8}}>
              <i className="fa fa-long-arrow-right"></i>
            </div>
            <div className="col-lg-9">
              <div className="col-lg-6">
                <select id="src_key"
                        className="form-control"
                        onChange={onSetCustomerMapping}
                        value={settings.getIn(['customer_identification_fields', 0, 'src_key'])}
                        defaultValue="-1">
                  { available_fields }
                </select>
              </div>
              <div className="col-lg-6">
                <select id="target_key"
                        className="form-control"
                        onChange={onSetCustomerMapping}
                        value={settings.getIn(['customer_identification_fields', 0, 'target_key'])}
                        defaultValue="sid">
                  { available_target_fields }
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="separator"></div>
        <div className="form-group">
          <div className="col-lg-3">
	    <h4>Rate by</h4>
          </div>
        </div>
        {available_usagetypes.map((usaget, key) => (
           <div key={key}>
             <div className="form-group">
               <div className="col-lg-3">
                 <label htmlFor={usaget}>
                   { usaget }
                 </label>
               </div>
               <div className="col-lg-9">
                 <div className="col-lg-1" style={{marginTop: 8}}>
                   <i className="fa fa-long-arrow-right"></i>
                 </div>
                 <div className="col-lg-10">
                   <div className="col-lg-3" style={{paddingLeft: 0}}>
                     <select className="form-control"
                             id={usaget}
                             onChange={onSetLineKey}
                             data-usaget={usaget}
                             value={settings.getIn(['rate_calculators', usaget, 0, 'line_key'])}
                             defaultValue="-1">
                       { available_fields }
                     </select>                 
                   </div>
                   <div className="col-lg-3">
                     <input type="radio"
                            name={`${usaget}-type`}
                            id={`${usaget}-by-rate-key`}
                            value="match"
                            data-usaget={usaget}
                            data-rate_key="key"
                            checked={settings.getIn(['rate_calculators', usaget, 0, 'type']) === "match"}
                            onChange={onSetRating} />
                     <label htmlFor={`${usaget}-by-rate-key`}>By rate key</label>
                   </div>
                   <div className="col-lg-4">
                     <input type="radio"
                            name={`${usaget}-type`}
                            id={`${usaget}-longest-prefix`}
                            value="longestPrefix"
                            data-usaget={usaget}
                            checked={settings.getIn(['rate_calculators', usaget, 0, 'type']) === "longestPrefix"}
                            data-rate_key="params.prefix"
                            onChange={onSetRating} />
                     <label htmlFor={`${usaget}-longest-prefix`}>By longest prefix</label>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         ))}
      </form>
    );
  }
}
