import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Field from '../Field';

class Subscriber extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { subscriber, onChangeFieldValue } = this.props;

    let subscriptions_html = !subscriber.get('subs') ?
                             [] :
                             subscriber.get('subs').map((sub, key) => (
                               <div className="row" key={key}>
                                 <div className="col-md-2">
                                   <label>
                                     <Link to={`/plan_setup?plan_id=${sub.get('plan_id')}`}>
                                       { sub.get('plan') }
                                     </Link>
                                   </label>
                                 </div>
                               </div>
                             ));
    
    return (
      <div className="Subscriber">
        <div className="row">
          <div className="col-md-2">
            <label for="FirstName">First Name</label>
            <Field id="FirstName" className="form-control" value={subscriber.get('FirstName')} onChange={onChangeFieldValue} />
          </div>
          <div className="col-md-2">
            <label for="LastName">Last Name</label>
            <Field id="LastName" className="form-control" value={subscriber.get('LastName')} onChange={onChangeFieldValue} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-10">
            <label for="Address">Address</label>
            <Field id="Address" coll="Subscriber" className="form-control" value={subscriber.get('Address')} onChange={onChangeFieldValue} />
          </div>
        </div>
        <hr/>
        <div>
          <h4>Subscriptions</h4>
          { subscriptions_html }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return state;
}

export default connect(mapStateToProps)(Subscriber);
