import React, { Component } from 'react';

import Select from 'react-select';

export default class Subscription extends Component {
  constructor(props) {
    super(props);
  }

  onChangeField() {
    console.log(arguments);
  }
  
  render() {
    const { subscription, plans, onSave, onCancel } = this.props;
    if (!subscription) return (null);
    const available_plans = plans.map((plan, key) => {
      return { value: plan.get('name'), label:  plan.get('name') };
    }).toJS();

    return (
      <div>

        <form className="form-horizontal">
          <div className="form-group">
            <div className="col-xs-11">
              <label>Plan</label>
              <Select id="plan"
                      className="form-control"
                      options={available_plans}
                      value={subscription.get('plan')}
                      onChange={this.onChangeField}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-xs-1">
              <button type="button"
                      className="btn btn-primary"
                      onClick={onSave}>
                Save
              </button>
            </div>
            <div className="col-xs-1">
              <button type="button"
                      className="btn btn-default"
                      onClick={onCancel}>
                Cancel
              </button>
            </div>
          </div>
        </form>

      </div>
    );
  }
}
