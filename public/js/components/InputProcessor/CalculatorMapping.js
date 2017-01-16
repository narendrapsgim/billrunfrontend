import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Form } from 'react-bootstrap';
import { getFieldName } from '../../common/Util';


export default class CalculatorMapping extends Component {

  static propTypes = {
    onSetCustomerMapping: PropTypes.func.isRequired,
    onSetLineKey: PropTypes.func.isRequired,
    onSetRating: PropTypes.func.isRequired,
    settings: PropTypes.instanceOf(Immutable.Map),
    subscriberFields: PropTypes.instanceOf(Immutable.List),
  }

  static defaultProps = {
    settings: Immutable.Map(),
  };

  onSetCustomerMapping = (index, e) => {
    const { value, id } = e.target;
    this.props.onSetCustomerMapping(id, value, index);
  }

  getAvailableFields = () => {
    const { settings } = this.props;
    const options = [
      (<option disabled value="" key={-1}>Select Field...</option>),
      ...settings.get('fields', []).map((field, key) => <option value={field} key={key}>{field}</option>),
    ];
    return options;
  }

  getAvailableTargetFields = () => {
    const { subscriberFields } = this.props;
    const optionsKeys = subscriberFields
      .filter(field => field.get('unique', false))
      .map(field => field.get('field_name', ''));
    const options = [
      (<option disabled value="-1" key={-1}>Select Field...</option>),
      ...optionsKeys.map((field, key) => <option value={field} key={key}>{getFieldName(field, 'customerIdentification')}</option>),
    ];
    return options;
  }

  renderCustomerIdentification = () => {
    const { settings } = this.props;
    const availableFields = this.getAvailableFields();
    const availableTargetFields = this.getAvailableTargetFields();
    const availableUsagetypes = settings.get('customer_identification_fields', Immutable.List());

    return availableUsagetypes.map((usaget, key) => {
      const regex = usaget.getIn(['conditions', 0, 'regex'], '');
      const label = regex.substring(2, regex.length - 2);
      const targetKey = usaget.getIn(['target_key'], 'sid');
      const srcKey = usaget.getIn(['src_key'], '');
      return (
        <div key={key}>
          <div className="form-group">
            <div className="col-lg-3">
              <label htmlFor={label}>{ label }</label>
            </div>
            <div className="col-lg-9">
              <div className="col-lg-1" style={{ marginTop: 8 }}>
                <i className="fa fa-long-arrow-right" />
              </div>
              <div className="col-lg-9">
                <div className="row">
                  <div className="col-lg-6">
                    <select id="src_key" className="form-control" onChange={this.onSetCustomerMapping.bind(this, key)} value={srcKey} >
                      { availableFields }
                    </select>
                  </div>
                  <div className="col-lg-6">
                    <select id="target_key" className="form-control" onChange={this.onSetCustomerMapping.bind(this, key)} value={targetKey}>
                      { availableTargetFields }
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  renderRateBy = () => {
    const { settings } = this.props;
    const availableFields = this.getAvailableFields();
    const availableUsagetypes = settings.get('rate_calculators', Immutable.Map());

    return availableUsagetypes.map((rateCalculator, usaget) => {
      const lineKey = settings.getIn(['rate_calculators', usaget, 0, 'line_key'], '');
      const isMatch = settings.getIn(['rate_calculators', usaget, 0, 'type'], '') === 'match';
      const islongestPrefix = settings.getIn(['rate_calculators', usaget, 0, 'type'], '') === 'longestPrefix';
      return (
        <div key={usaget}>
          <div className="form-group">
            <div className="col-lg-3">
              <label htmlFor={usaget}>{ usaget }</label>
            </div>
            <div className="col-lg-9">
              <div className="col-lg-1" style={{ marginTop: 8 }}>
                <i className="fa fa-long-arrow-right" />
              </div>
              <div className="col-lg-10">
                <div className="col-lg-3" style={{ paddingLeft: 0 }}>
                  <select className="form-control" id={usaget} onChange={this.props.onSetLineKey} data-usaget={usaget} value={lineKey} >
                    { availableFields }
                  </select>
                </div>
                <div className="col-lg-3" style={{ marginTop: 10 }}>
                  <input type="radio" name={`${usaget}-type`} id={`${usaget}-by-rate-key`} value="match" data-usaget={usaget} data-rate_key="key" checked={isMatch} onChange={this.props.onSetRating} />
                  <label htmlFor={`${usaget}-by-rate-key`} style={{ verticalAlign: 'middle' }}>&nbsp;By rate key</label>
                </div>
                <div className="col-lg-4" style={{ marginTop: 10 }}>
                  <input type="radio" name={`${usaget}-type`} id={`${usaget}-longest-prefix`} value="longestPrefix" data-usaget={usaget} checked={islongestPrefix} data-rate_key="params.prefix" onChange={this.props.onSetRating} />
                  <label htmlFor={`${usaget}-longest-prefix`} style={{ verticalAlign: 'middle' }}>&nbsp;By longest prefix</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <Form horizontal className="CalculatorMapping">

        <div className="form-group">
          <div className="col-lg-12">
            <h4>
              Customer identification
              <small> | Map customer identification field in record to Billrun field</small>
            </h4>
          </div>
        </div>
        { this.renderCustomerIdentification().toArray() }

        <div className="separator" />

        <div className="form-group">
          <div className="col-lg-12">
            <h4>Rate by</h4>
          </div>
        </div>
        { this.renderRateBy() }
      </Form>
    );
  }
}
