import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Immutable from 'immutable';

import Field from '../Field';

class Subscriber extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { items, onChangeFieldValue, onUnsubscribe } = this.props;
    let subscriber = items.find(obj => { return obj.get('type') === "account"; }) || Immutable.Map();
    let subscriptions = items.reduce((r, obj, k) => {
      if (obj.get('type') !== "account")
        return r.push(obj);
      return r;
    }, Immutable.List());
    
    let subscriptions_html = subscriptions.map((sub, key) => (
                               <div className="row" key={key}>
                                 <div className="col-md-2">
                                   <Link to={`/plan_setup?plan_id=${sub.get('plan_ref')}`}>
                                     { sub.get('plan') }
                                   </Link>
                                 </div>
                                 <div className="col-md-1">
                                   <a style={{cursor: "pointer"}} onClick={onUnsubscribe.bind(this, sub.get('sid'))}>(unsubscribe)</a>
                                 </div>
                               </div>
                             ));
    
    return (
      <div className="Subscriber">
        <div className="row">
          <div className="col-md-2">
            <label for="first_name">First Name</label>
            <Field id="first_name" className="form-control" value={subscriber.get('first_name')} onChange={onChangeFieldValue} />
          </div>
          <div className="col-md-2">
            <label for="last_name">Last Name</label>
            <Field id="last_name" className="form-control" value={subscriber.get('last_name')} onChange={onChangeFieldValue} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-10">
            <label for="Address">Address</label>
            <Field id="address" coll="Subscriber" className="form-control" value={subscriber.get('address')} onChange={onChangeFieldValue} />
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
  return {items: state.subscriber};
}

export default connect(mapStateToProps)(Subscriber);
