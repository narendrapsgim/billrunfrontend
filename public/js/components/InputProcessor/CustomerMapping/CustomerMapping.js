import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { getFieldName, getAvailableFields } from '../../../common/Util';

export default class CustomerMapping extends Component {
  static propTypes = {
    settings: PropTypes.instanceOf(Immutable.Map),
    usaget: PropTypes.instanceOf(Immutable.Map).isRequired,
    index: PropTypes.number.isRequired,
    onSetCustomerMapping: PropTypes.func.isRequired,
    subscriberFields: PropTypes.instanceOf(Immutable.List),
  }

  static defaultProps = {
    settings: Immutable.Map(),
    subscriberFields: Immutable.List(),
  };

  onSetCustomerMapping = (e) => {
    const { index } = this.props;
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

  render() {
    const { usaget } = this.props;
    const targetKey = usaget.getIn(['target_key'], 'sid');
    const srcKey = usaget.getIn(['src_key'], '');
    const availableFields = this.getCustomerIdentificationFields();
    const availableTargetFields = this.getAvailableTargetFields();
    return (
      <div>
        <div className="col-lg-6">
          <select id="src_key" className="form-control" onChange={this.onSetCustomerMapping} value={srcKey} >
            { availableFields }
          </select>
        </div>
        <div className="col-lg-6">
          <select id="target_key" className="form-control" onChange={this.onSetCustomerMapping} value={targetKey}>
            { availableTargetFields }
          </select>
        </div>
      </div>
    );
  }
}
