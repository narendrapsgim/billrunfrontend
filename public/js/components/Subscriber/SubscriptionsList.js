import React, { Component } from 'react';
import { Link } from 'react-router';

import { Table, TableHeader, TableRow, TableHeaderColumn, TableRowColumn, TableBody } from 'material-ui/Table';

export default class SubscriptionsList extends Component {
  constructor(props) {
    super(props);
  }
  
  titlize(str) {
    return _.capitalize(str.replace(/_/g, ' '));
  }

  render() {
    const { subscribers,
            onClickNewSubscription,
            settings,
            account,
            onClickEditSubscription } = this.props;

    const displayFields = settings.getIn(['subscriber', 'fields'])
                                  .filter(field => { return field.get('field') !== false; });

    const subscriptionsHTML = subscribers.map((sub, key) => {
      return (
        <TableRow key={key}>
          {displayFields.map((field, k) => (
                     <TableRowColumn key={k}>
                       {sub.get(field.get('field_name'))}
                     </TableRowColumn>
                   ))}
                     <TableRowColumn>
                       <Link to={`/usage?base=${JSON.stringify({sid: sub.get('sid')})}`}>
                         Usage
                       </Link>
                       &nbsp;
                       <button className="btn btn-link"
                               onClick={onClickEditSubscription.bind(this, sub.get('sid'))}>
                         Edit
                       </button>
                     </TableRowColumn>
        </TableRow>
      );
    });

    return (
      <div style={{margin: 10}}>
        <div className="row">
          <div className="col-xs-11">
            <div className="pull-right">
              <button className="btn btn-primary" onClick={onClickNewSubscription.bind(this, account.get('aid'))}>Add Subscription</button>
            </div>
            <div className="pull-left">
              <h4>Subscriptions</h4>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-11">
            <Table selectable={false}>
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                  {displayFields.map((field, key) => (
                             <TableRowColumn key={key}>{this.titlize(field.get('field_name'))}</TableRowColumn>
                           ))}
                             <TableRowColumn></TableRowColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false} stripedRows={true}>
                { subscriptionsHTML }
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}
