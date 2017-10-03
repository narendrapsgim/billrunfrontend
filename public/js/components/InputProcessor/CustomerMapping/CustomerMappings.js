import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Form } from 'react-bootstrap';
import CustomerMapping from './CustomerMapping';

export default class CustomerMappings extends Component {
  static propTypes = {
    settings: PropTypes.instanceOf(Immutable.Map),
    onSetCustomerMapping: PropTypes.func.isRequired,
    subscriberFields: PropTypes.instanceOf(Immutable.List),
  }

  static defaultProps = {
    settings: Immutable.Map(),
    subscriberFields: Immutable.List(),
  };

  render() {
    const { settings, onSetCustomerMapping, subscriberFields } = this.props;
    const availableUsagetypes = settings.get('customer_identification_fields', Immutable.List());
    return (
      <Form horizontal className="customerMappings">
        <div className="form-group">
          <div className="col-lg-12">
            <h4>
              Customer identification
              <small> | Map customer identification field in record to BillRun field</small>
            </h4>
          </div>
        </div>
        {availableUsagetypes.map((usaget, key) => {
          const regex = usaget.getIn(['conditions', 0, 'regex'], '');
          const label = regex.substring(2, regex.length - 2);
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
                      <CustomerMapping
                        usaget={usaget}
                        index={key}
                        onSetCustomerMapping={onSetCustomerMapping}
                        subscriberFields={subscriberFields}
                        settings={settings}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }).toArray()}
      </Form>
    );
  }
}
