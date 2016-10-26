import React, { Component } from 'react';
import { Link } from 'react-router';
import List from '../List';
import { Button } from "react-bootstrap";
import Immutable from 'immutable';
import moment from 'moment';


export default class SubscriptionsList extends Component {
  constructor(props) {
    super(props);

    this.subscription_row = this.subscription_row.bind(this);
  }

  subscription_row(sub) {
    const { settings } = this.props;
    return settings.filter(field => { return field.get('display') !== false }).map((field, key) => (
      <td key={key}>{ sub.get(field.get('field_name')) }</td>
    ))
  }

  planActivationParser = (subscription) => {
    let date = subscription.get('plan_activation', null);
    return date ? moment(date).format(globalSetting.datetimeFormat) : '';
  }

  servicesParser = (subscription) => {
    return subscription.get('services', Immutable.List()).join(', ');
  }

  render() {
    const { subscriptions,
            settings,
            aid,
            onNew,
            onClickEdit } = this.props;

    const fields = settings
      .filter(field => { return field.get('display') !== false })
      .map((field, idx) => {
        let fieldname = field.get('field_name');
        switch (fieldname) {
          case 'plan_activation':
            return { id: fieldname, parser: this.planActivationParser };
          case 'services':
            return { id: fieldname, parser: this.servicesParser };
          default:
            return { id: fieldname };
        }
      });

    return (
      <div>

        <div className="row">
          <div className="col-lg-12">
            <List items={subscriptions} fields={fields.toArray()} edit={true} onClickEdit={onClickEdit} />
            <Button bsSize="xsmall" className="btn-primary" onClick={onNew.bind(this, aid)}><i className="fa fa-plus"/>&nbsp;Add New Subscription</Button>
          </div>
        </div>

      </div>
    );
  }
}
