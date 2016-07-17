import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { getCustomer, clearCustomer, getNewCustomer, updateCustomerField, saveSubscriber, getSubscriberSettings } from '../../actions/customerActions';
import { getSettings } from '../../actions/settingsActions';

import New from './New';
import Edit from './Edit';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class SubscriberEdit extends Component {
  constructor(props) {
    super(props);

    this.onChangeFieldValue = this.onChangeFieldValue.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onUnsubscribe = this.onUnsubscribe.bind(this);
    this.onClickNewSubscription = this.onClickNewSubscription.bind(this);

    this.state = {
      newCustomer: false
    };
  }

  componentWillMount() {
    const { aid } = this.props.location.query;
    if (aid) {
      this.setState({newCustomer: false});
      this.props.dispatch(getCustomer(aid));
      
    } else {
      this.setState({newCustomer: true});
      this.props.dispatch(getNewCustomer());
    }
    this.props.dispatch(getSettings('subscribers'));
  }

  componentWillUnmount() {
    this.props.dispatch(clearCustomer());
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
    const action = this.state.newCustomer ? "new" : this.props.location.query.action;
    this.props.dispatch(saveSubscriber(action, this.props.items));
  }

  onClickNewSubscription(aid) {
    this.setState({aid, newCustomer: true});
    this.props.dispatch(getNewCustomer(aid));
  }
  
  onCancel() {
    browserHistory.goBack();
  }
  
  render() {
    const { items, settings } = this.props;
    const { newCustomer, aid } = this.state;
    const view = this.state.newCustomer ? (<New entity={items} aid={aid} settings={settings} onChange={this.onChangeFieldValue} />) : (<Edit items={items} settings={settings} onChange={this.onChangeFieldValue} onClickNewSubscription={this.onClickNewSubscription} />);

    return (
      <div className="SubscriberEdit container">
        <h3>Customer</h3>
        <div className="contents bordered-container">
          { view }
          {/* <Subscriber onChangeFieldValue={this.onChangeFieldValue} onUnsubscribe={this.onUnsubscribe} newCustomer={this.state.newCustomer} /> */}
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
  return {items: state.subscriber.get('customer'),
          settings: state.settings};
}

export default connect(mapStateToProps)(SubscriberEdit);
