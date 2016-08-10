import React, { Component } from 'react';
import Immutable from 'immutable';
import { Link } from 'react-router';
import { Table, TableHeader, TableRow, TableHeaderColumn, TableRowColumn, TableBody } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';

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
    const { subscribers,
            account,
            settings,
            onChange,
            onClickNewSubscription,
            onSave,
            newCustomer,
            onCancel } = this.props;
    if (!settings) return (null);

    const subscriptionsHTML = subscribers.map((sub, key) => {
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

    const subscribersView = (
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
                { subscriptionsHTML }
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );

    const fieldsHTML = settings.getIn(['account', 'fields']).map((field, key) => {
      if (field.get('display') === false) return (null);
      let val = account.get(field.get('field_name')) || '';
      return (
        <div className="col-xs-3" key={key}>
          <label>{_.capitalize(field.get('field_name'))}</label>
          <Field id={field.get('field_name')}
                 value={val}
                 editable={field.get('editable')}
                 onChange={onChange} />
        </div>
      );
    });
    
    let fields = (
      <div className="form-group">
        { fieldsHTML }
        <div className="col-xs-1">
          <label>&zwnj;</label>
          <div>
            <Link to={`/usage?base=${JSON.stringify({aid: account.get('aid')})}`}>
              <button className="btn">See usage</button>
            </Link>
          </div>
        </div>
      </div>
    );
    
    return (
      <Tabs defaultActiveKey={1} animation={false} id="CustomerEditSettings">
        <Tab title="Customer Details" eventKey={1}>
          <form className="form-horizontal" style={{margin: 10}}>
            { fields }
            <div className="form-group">
              <div className="col-xs-1">
                <RaisedButton
                    label={'Save'}
                    primary={true}
                    onTouchTap={onSave}
                />
              </div>
              <div className="col-xs-1">
                <FlatButton
                    label="Cancel"
                    onTouchTap={onCancel}
                />
              </div>
            </div>
          </form>
        </Tab>
        {(() => {
           if (!newCustomer) {
             return (
               <Tab title="Subscriptions" eventKey={2}>
                 { subscribersView }
               </Tab>
             );
           }
         })()}
      </Tabs>
    );    
  }
}
