import React, { Component } from 'react';
import { Link } from 'react-router';
import List from '../List';
import { Button } from "react-bootstrap";

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

  onClickSubscription(entity) {
    
  }
  
  render() {
    const { subscriptions,
            settings,
            aid,
            onNew,
            onEdit } = this.props;

    const fields = settings
      .filter(field => { return field.get('display') !== false })
      .map((field, idx) => {
        return { id: field.get('field_name') };
      });

    return (
      <div>

        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                <span>
                  All action subscriptions
                  <div className="pull-right">
                    <Button bsSize="xsmall" className="btn-primary" onClick={onNew.bind(this, aid)}><i className="fa fa-plus"/>&nbsp;Add New</Button>
                  </div>
                </span>
              </div>
              <div className="panel-body">
                <List items={subscriptions} fields={fields} onClick={this.onClickSubscription} />
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
