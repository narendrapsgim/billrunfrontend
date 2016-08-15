import React, { Component } from 'react';
import { connect } from 'react-redux';

import Field from '../Field';
import { getPlans } from '../../actions/plansActions';

class Subscription extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(getPlans({size: 100000,
                                  filter: `to: {$gt: ${moment().format()}}`}));
  }
  
  render() {
    const { subscription, settings, onChange, plans } = this.props;

    const available_plans = plans ? plans.map((plan, key) => {
      return (
        <option value={plan.get('name')} key={key}>{plan.get('name')}</option>
      );
    }).toJS() : [];

    return (
      <div style={{margin: 10}}>
        <div className="row">
          <div className="col-xs-11">
            <label>Plan</label>
            <select className="form-control"
                    value={subscription.get('plan')}
                    onChange={onChange} >
              { available_plans }
            </select>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { plans: state.plans };
}

export default connect(mapStateToProps)(Subscription);
