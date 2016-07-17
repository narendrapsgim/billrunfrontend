import React, { Component } from 'react';
import Immutable from 'immutable';
import { Link } from 'react-router';
import { Table, TableHeader, TableRow, TableHeaderColumn, TableRowColumn, TableBody } from 'material-ui/Table';

import Field from '../Field';
import _ from 'lodash';

export default class Edit extends Component {
  constructor(props) {
    super(props);
  }

  titlize(str) {
    return _.capitalize(str.replace(/_/g, ' '));
  }
  
  render() {
    const { items, settings, onChange, onClickNewSubscription } = this.props;
    if (!items || !settings) return (<div></div>);

    const account = items.find((obj) => {
      return obj.get('type') === "account";
    });
    if (!account) return (<div></div>)

    const subscriptions = items.reduce((r, obj, k) => {
      if (obj.get('type') !== "account")
        return r.push(obj);
      return r;
    }, Immutable.List());

    let subscriptions_html = subscriptions.map((sub, key) => {
      return (
        <TableRow key={key}>
          {settings.getIn(['subscriber', 'fields']).map((field, k) => {
             if (field.get('display') === false) return (null);
             return (
               <TableRowColumn key={k}>
                 {sub.get(field.get('field_name'))}
               </TableRowColumn>
             );
           })}
               <TableRowColumn>
                 <Link to={`/usage?base=${JSON.stringify({sid: sub.get('sid')})}`}>
                   See usage
                 </Link>
               </TableRowColumn>
        </TableRow>
      );
    });

    let fields = (
      <div className="row">
        {settings.getIn(['account', 'fields']).map((field, key) => {
           if (field.get('display') === false) return (null);
           return (
             <div className="col-md-3" key={key}>
               <label>{_.capitalize(field.get('field_name'))}</label>
               <Field id={field.get('field_name')}
                      value={account.get(field.get('field_name'))}
                      editable={field.get('editable')}
                      onChange={onChange} />
             </div>
           );
         })}
             <div className="col-md-1">
               <Link to={`/usage?base=${JSON.stringify({aid: account.get('aid')})}`}>
                 See usage
               </Link>
             </div>
      </div>
    );
    
    return (
      <div>
        { fields }
        <hr/>
        <div>
          <div className="row">
            <div className="col-md-11">
              <div className="pull-right">
                <button className="btn btn-primary" onClick={onClickNewSubscription.bind(this, account.get('aid'))}>Add Subscription</button>
              </div>
              <div className="pull-left">
                <h4>Subscriptions</h4>
              </div>
            </div>
          </div>
          <Table selectable={false}>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
            {settings.getIn(['subscriber', 'fields']).map((field, key) => {
               if (field.get('display') === false) return (null);
               return (
                 <TableRowColumn key={key}>{this.titlize(field.get('field_name'))}</TableRowColumn>
               );
             })}
                 <TableRowColumn></TableRowColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} stripedRows={true}>
              { subscriptions_html }
            </TableBody>
          </Table>
        </div>
      </div>
    );    
  }
}
