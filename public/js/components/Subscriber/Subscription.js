import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import Field from '../Field';
import { getPlans } from '../../actions/plansActions';

class Subscription extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(getPlans({size: 100000,
                                  filter: JSON.stringify({to: {$gt: moment().toISOString()}})}));
  }
  
  render() {
    const { subscription,
            settings,
            plans,
            onChange,
            onSave,
            onCancel } = this.props;

    const available_plans = plans ? plans.map((plan, key) => {
      return (
        <option value={plan.get('name')} key={key}>{plan.get('name')}</option>
      );
    }).toJS() : [];

    return (
      <div style={{margin: 10}}>
        <form className="form-horizontal">
          <div className="form-group">
            <div className="col-xs-11">
              <label>Plan</label>
              <select id="plan"
                      className="form-control"
                      value={subscription.plan}
                      onChange={onChange} >
                { available_plans }
              </select>
            </div>
          </div>
          <div className="form-group">
            <div className="col-xs-1">
              <RaisedButton
                  label={'Save'}
                  primary={true}
                  onTouchTap={onSave}
              />
            </div>
            <div className="col-xs-1">
              <FlatButton
                  label="Cancel"
                  onTouchTap={onCancel}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { plans: state.plans };
}

export default connect(mapStateToProps)(Subscription);
