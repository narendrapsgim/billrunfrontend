import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';

import { getCustomer, clearCustomer, getNewCustomer, updateAccountField, updateCustomerField, saveSubscriber, getSubscriberSettings } from '../../actions/customerActions';
import { getSettings } from '../../actions/settingsActions';

import New from './New';
import Edit from './Edit';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class SubscriberEdit extends Component {
  constructor(props) {
    super(props);

    this.onChangeAccountFieldValue = this.onChangeAccountFieldValue.bind(this);
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
    const { value, id } = e.target;
    this.props.dispatch(updateCustomerField(id, value));
  }
  
  onChangeAccountFieldValue(idx, e) {
    let { value, id } = e.target;
    this.props.dispatch(updateAccountField(idx, id, value));
  }

  onUnsubscribe(sid) {
    let r = confirm("Unsubscribe from plan?");
    if (r) console.log(`unsubscribe from plan ${sid}`);
  }
  
  onSave() {
    const action = this.state.newCustomer ? "new" : this.props.location.query.action;
    this.props.dispatch(saveSubscriber(action, this.props.items));
    if (this.state.aid) {
      this.props.dispatch(getCustomer(this.state.aid));
      this.setState({newCustomer: false});
    }
  }

  onCancel() {
    const { aid, newCustomer } = this.state;
    if (aid && newCustomer) {
      this.props.dispatch(getCustomer(aid));
      this.setState({newCustomer: false});
      return;
    }
    browserHistory.goBack();
  }

  onClickNewSubscription(aid) {
    this.setState({aid, newCustomer: true});
    this.props.dispatch(getNewCustomer(aid));
  }
    
  render() {
    const { items, settings } = this.props;
    const { newCustomer, aid } = this.state;
    const view = this.state.newCustomer ? (<New entity={items} aid={aid} settings={settings} onChange={this.onChangeFieldValue} onSave={this.onSave} onCancel={this.onCancel} />) : (<Edit items={items} settings={settings} onChange={this.onChangeAccountFieldValue} onClickNewSubscription={this.onClickNewSubscription} onSave={this.onSave} onCancel={this.onCancel} />);

    return (
      <div className="SubscriberEdit container">
        <h3>Customer</h3>
        <div className="contents bordered-container">
          { view }
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
