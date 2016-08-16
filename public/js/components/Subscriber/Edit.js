import React, { Component } from 'react';
import Immutable from 'immutable';
import { Link } from 'react-router';
import { Table, TableHeader, TableRow, TableHeaderColumn, TableRowColumn, TableBody } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';

import Field from '../Field';
import SubscriptionsList from './SubscriptionsList';
import Subscription from './Subscription';
import _ from 'lodash';

export default class Edit extends Component {
  constructor(props) {
    super(props);

    this.onClickEditSubscription = this.onClickEditSubscription.bind(this);
    this.onChangeSubscriptionField = this.onChangeSubscriptionField.bind(this);
    
    this.state = {
      editSubscriber: false,
      sid: null,
      plan: null
    };
  }

  onClickEditSubscription(sid) {
    this.setState({editSubscriber: false, sid: null, plan: null}, () => {
      this.setState({editSubscriber: true, sid});
    });
  }

  onChangeSubscriptionField() {
    console.log(arguments);
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

    const subscription = this.state.editSubscriber ? subscribers.find(sub => {
      return sub.get('sid') === this.state.sid;
    }) : null
    const subscribersView = !this.state.editSubscriber ?
                            (<SubscriptionsList account={account}
                                                onClickNewSubscription={onClickNewSubscription}
                                                onClickEditSubscription={this.onClickEditSubscription}
                                                settings={settings}
                                                subscribers={subscribers} />) :
                            (<Subscription subscription={subscription}
                                           settings={settings}
                                           onChange={this.onChangeSubscriptionField}
                                           onSave={this.onSaveSubscription} />);

    const fieldsHTML = settings.getIn(['account', 'fields']).map((field, key) => {
      if (field.get('display') === false) return (null);
      let val = account.get(field.get('field_name')) || '';
      return (
        <div className="form-group" key={key}>
          <div className="col-xs-3">
            <label>{_.capitalize(field.get('field_name'))}</label>
            <Field id={field.get('field_name')}
                   value={val}
                   editable={field.get('editable')}
                   onChange={onChange} />
          </div>
        </div>
      );
    });
    
    const fields = (
      <div>
        { fieldsHTML }
        <div className="form-group">
          <div className="col-xs-1">
            <label>&zwnj;</label>
            <div>
              <Link to={`/usage?base=${JSON.stringify({aid: account.get('aid')})}`}>
                <button className="btn">See usage</button>
              </Link>
            </div>
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
