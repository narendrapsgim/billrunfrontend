import React, { Component } from 'react';
import { Link } from 'react-router';

import { DropdownButton, MenuItem } from "react-bootstrap";

/* ACTIONS */
import { titlize } from '../../common/Util';

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
  
  render() {
    const { subscriptions,
            settings,
            aid,
            onNew,
            onEdit } = this.props;

    const table_header = settings.filter(field => { return field.get('display') !== false }).map((field, key) => (
      <th key={key}>{ titlize(field.get('field_name')) }</th>
    ));
  
    const table_body = subscriptions.map((sub, key) => (
      <tr key={key}>
        { this.subscription_row(sub) }
      </tr>
    ));
    
    return (
      <div>

        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                <span>
                  All action subscriptions
                  <div className="pull-right">
                    <DropdownButton title="Actions" id="ActionsDropDown" bsSize="xs" pullRight>
                      <MenuItem eventKey="1" onClick={onNew.bind(this, aid)}>New</MenuItem>
                    </DropdownButton>
                  </div>
                </span>
              </div>
              <div className="panel-body">
                <div className="table-responsive">
                  <table className="table table-hover table-striped">
                    <thead>
                      <tr>{ table_header }</tr>
                    </thead>
                    <tbody>
                      { table_body }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
