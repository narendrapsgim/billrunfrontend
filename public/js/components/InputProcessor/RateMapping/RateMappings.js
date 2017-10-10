import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Form } from 'react-bootstrap';
import RateMapping from './RateMapping';

export default class RateMappings extends Component {
  static propTypes = {
    settings: PropTypes.instanceOf(Immutable.Map),
    customRatingFields: PropTypes.instanceOf(Immutable.List),
  }

  static defaultProps = {
    settings: Immutable.Map(),
    customRatingFields: Immutable.List(),
  };

  render() {
    const { settings, customRatingFields } = this.props;
    const availableUsagetypes = settings.get('rate_calculators', Immutable.Map()).keySeq().map(usaget => (usaget));
    return (
      <Form horizontal className="rateMappings">
        <div className="form-group">
          <div className="col-lg-12">
            <h4>
              Rate by
            </h4>
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
                    customRatingFields={customRatingFields}
                    settings={settings}
                  />
                </div>
              </div>
            </div>
          </div>
        )).toArray()}
      </Form>
    );
  }
}
