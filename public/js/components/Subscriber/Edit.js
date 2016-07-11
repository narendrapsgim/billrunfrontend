import React, { Component } from 'react';
import Immutable from 'immutable';
import { Link } from 'react-router';

export default class Edit extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { items, settings, onChange } = this.props;
    if (!items) return (<div></div>);

    const account = items.find((obj) => {
      return obj.get('type') === "account";
    });

    const subscriptions = items.reduce((r, obj, k) => {
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
                                   {/* <a style={{cursor: "pointer"}} onClick={onUnsubscribe.bind(this, sub.get('sid'))}>(unsubscribe)</a> */}
                                 </div>
                               </div>
                             ));


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
      <div>
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
