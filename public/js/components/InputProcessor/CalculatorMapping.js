import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Form } from 'react-bootstrap';
import RateMapping from './RateMapping/RateMapping';
import { getFieldName, getAvailableFields } from '../../common/Util';

export default class CalculatorMapping extends Component {
  static propTypes = {
    onSetCustomerMapping: PropTypes.func.isRequired,
    settings: PropTypes.instanceOf(Immutable.Map),
    subscriberFields: PropTypes.instanceOf(Immutable.List),
    customRatingFields: PropTypes.instanceOf(Immutable.List),
  }
  static defaultProps = {
    settings: Immutable.Map(),
    subscriberFields: Immutable.List(),
    customRatingFields: Immutable.List(),
  };

  onSetCustomerMapping = (index, e) => {
    const { value, id } = e.target;
    this.props.onSetCustomerMapping(id, value, index);
  }

  getCustomerIdentificationFields = () =>
    getAvailableFields(this.props.settings).map((field, key) => (
      <option value={field.get('value', '')} key={key}>{field.get('label', '')}</option>
    ));

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
    const availableFields = this.getCustomerIdentificationFields();
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

  render() {
    const { settings } = this.props;
    const availableUsagetypes = settings.get('rate_calculators', Immutable.Map()).keySeq().map(usaget => (usaget));
    return (
      <Form horizontal className="CalculatorMapping">
        <div className="form-group">
          <div className="col-lg-12">
            <h4>
              Customer identification
              <small> | Map customer identification field in record to BillRun field</small>
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
        {availableUsagetypes.map((usaget, key) => (
          <div key={key}>
            <div className="form-group">
              <div className="col-lg-3">
                <label htmlFor={usaget}>
                  { usaget }
                </label>
              </div>
              <div className="col-lg-9">
                <div className="col-lg-1" style={{ marginTop: 8 }}>
                  <i className="fa fa-long-arrow-right" />
                </div>
                <div className="col-lg-11">
                  <RateMapping
                    usaget={usaget}
                    customRatingFields={this.props.customRatingFields}
                    settings={settings}
                  />
                </div>
              </div>
            </div>
          </div>
         ))}
      </Form>
    );
  }
}
