import React, { Component } from 'react';
import { connect } from 'react-redux';

class Subscriber extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { subscriber, onChangeFieldValue } = this.props;

    return (
      <div className="Subscriber">
        <div className="row">
          <div className="col-md-2">
            <label for="FirstName">First Name</label>
            <input type="text" id="FirstName" className="form-control" value={subscriber.FirstName} onChange={onChangeFieldValue.bind(this, "subscriber")} />
          </div>
          <div className="col-md-2">
            <label for="LastName">Last Name</label>
            <input type="text" id="LastName" className="form-control" value={subscriber.LastName} onChange={onChangeFieldValue.bind(this, "subscriber")} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  if (state.subscriber)
    return {subscriber: state.subscriber}
  return {};
}

export default connect(mapStateToProps)(Subscriber);
