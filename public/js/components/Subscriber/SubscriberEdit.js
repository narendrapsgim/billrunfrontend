import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { getCustomer, updateCustomerField, saveSubscriber, getSubscriberSettings } from '../../actions/customerActions';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Subscriber from './Subscriber';

class SubscriberEdit extends Component {
  constructor(props) {
    super(props);

    this.onChangeFieldValue = this.onChangeFieldValue.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onUnsubscribe = this.onUnsubscribe.bind(this);
  }

  componentWillMount() {
    let { aid } = this.props.location.query;
    if (aid) {
      this.props.dispatch(getCustomer(aid));
      this.props.dispatch(getSubscriberSettings());
    }
  }
  
  onChangeFieldValue(e) {
    let { value, id } = e.target;
    this.props.dispatch(updateCustomerField(id, value));
  }

  onUnsubscribe(sid) {
    let r = confirm("Unsubscribe from plan?");
    if (r) console.log(`unsubscribe from plan ${sid}`);
  }
  
  onSave() {
    this.props.dispatch(saveSubscriber());
  }

  onCancel() {
    browserHistory.goBack();
  }
  
  render() {
    return (
      <div className="SubscriberEdit container">
        <h3>Subscriber</h3>
        <div className="contents bordered-container">
          <Subscriber onChangeFieldValue={this.onChangeFieldValue} onUnsubscribe={this.onUnsubscribe} />
        </div>
        <div style={{marginTop: 12, float: "right"}}>
          <FlatButton
              label="Cancel"
              onTouchTap={this.onCancel}
              style={{marginRight: 12}}
          />
          <RaisedButton
              label={'Save'}
              primary={true}
              onTouchTap={this.onSave}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(SubscriberEdit);
