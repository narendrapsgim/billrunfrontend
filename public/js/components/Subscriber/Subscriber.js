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
    let { items, settings, onChangeFieldValue, onUnsubscribe } = this.props;
    if (!items) return (<div></div>);
    let account = items.find((obj) => {
      return obj.get('type') === "account";
    });
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

    console.log(settings.toJS());
    let fields = settings.getIn(['account', 'fields']).map((field, key) => {
      return (
        <div className="row" key={key}>
          <div className="col-md-3">
            <label>{field.get('field_name')}</label>
            <input disabled={!field.get('editable')} id={field.get('field_name')} className="form-control" required={field.get('mandatory')} value={account.get(field.get('field_name'))}/>
          </div>
        </div>
      );
    });
    
    return (
      <div className="Subscriber">
        { fields }
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
  return {items: state.subscriber.get('customer'),
          settings: state.subscriber.get('settings')};
}

export default connect(mapStateToProps)(Subscriber);
