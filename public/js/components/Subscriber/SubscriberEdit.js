import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getCustomer } from '../../actions';
import Subscriber from './Subscriber';

class SubscriberEdit extends Component {
  constructor(props) {
    super(props);

    this.onChangeFieldValue = this.onChangeFieldValue.bind(this);
  }

  componentWillMount() {
    let { subscriber_id } = this.props.location.query;
    if (subscriber_id) {
      this.props.dispatch(getCustomer(subscriber_id));
    }
  }
  
  onChangeFieldValue(section, e) {
    let {value, id } = e.target;
    this.props.dispatch(updatePlanpField(section, id, value));
  }

  render() {
    return (
      <div className="SubscriberEdit container">
        <h3>Subscriber</h3>
        <div className="contents" style={{border: "2px solid #C0C0C0"}}>
          <Subscriber onChangeFieldValue={this.onChangeFieldValue} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state.subscriber || {};
}

export default connect(mapStateToProps)(SubscriberEdit);
