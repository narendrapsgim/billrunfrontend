import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import Field from '../../Field';
import { getFieldName, getAvailableFields } from '../../../common/Util';

export default class CustomerMapping extends Component {
  static propTypes = {
    settings: PropTypes.instanceOf(Immutable.Map),
    usaget: PropTypes.string.isRequired,
    mapping: PropTypes.instanceOf(Immutable.Map).isRequired,
    priority: PropTypes.number.isRequired,
    onSetCustomerMapping: PropTypes.func.isRequired,
    subscriberFields: PropTypes.instanceOf(Immutable.List),
  }

  static defaultProps = {
    settings: Immutable.Map(),
    subscriberFields: Immutable.List(),
  };

  onSetCustomerMapping = (e) => {
    const { usaget, priority } = this.props;
    const { value, id } = e.target;
    this.props.onSetCustomerMapping(id, value, usaget, priority);
  }

  onChangeClearRegex = (value) => {
    const { usaget, priority } = this.props;
    this.props.onSetCustomerMapping('clear_regex', value, usaget, priority);
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

  render() {
    const { mapping } = this.props;
    const targetKey = mapping.getIn(['target_key'], 'sid');
    const srcKey = mapping.getIn(['src_key'], '');
    const clearRegex = mapping.getIn(['clear_regex'], '');
    const availableFields = this.getCustomerIdentificationFields();
    const availableTargetFields = this.getAvailableTargetFields();
    return (
      <div>
        <div className="col-lg-4">
          <select id="src_key" className="form-control" onChange={this.onSetCustomerMapping} value={srcKey} >
            { availableFields }
          </select>
        </div>
        <div className="col-lg-4">
          <Field
            value={clearRegex}
            id="clear_regex"
            disabledValue={'//'}
            onChange={this.onChangeClearRegex}
            label="Regex"
            fieldType="toggeledInput"
          />
        </div>
        <div className="col-lg-4">
          <select id="target_key" className="form-control" onChange={this.onSetCustomerMapping} value={targetKey}>
            { availableTargetFields }
          </select>
        </div>
      </div>
    );
  }
}
