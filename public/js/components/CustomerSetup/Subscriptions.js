import React, { Component } from 'react';

/* COMPONENTS */
import SubscriptionsList from './SubscriptionsList';
import Subscription from './Subscription';

export default class Subscriptions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: false
    };
  }

  onClickEdit  = (subscription) => { this.setState({edit: true, subscription}); };
  onCancelEdit = () => { this.setState({edit: false, subscription: null}); };
  onSaveSubscription = (subscription, data) => {
    const callback = (passed) => {
      if (passed) this.setState({edit: false});
    }
    this.props.onSaveSubscription(subscription, data, callback);
  };
  
  render() {
    const { edit, subscription } = this.state;

    return (
      <div>
        {
          edit ? 
          <Subscription { ...this.props }
                        subscription={ subscription }
                        onSave={ this.onSaveSubscription }
                        onCancel={this.onCancelEdit} /> :
          <SubscriptionsList { ...this.props }
                             onClickEdit={ this.onClickEdit } />
        }    
      </div>
    );
  }

}
