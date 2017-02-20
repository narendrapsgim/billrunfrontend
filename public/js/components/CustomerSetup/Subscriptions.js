import React, { Component, PropTypes } from 'react';
/* COMPONENTS */
import SubscriptionsList from './SubscriptionsList';
import Subscription from './Subscription';

export default class Subscriptions extends Component {

  static propTypes = {
    onSaveSubscription: PropTypes.func.isRequired,
  };

  state = {
    subscription: null,
  }

  onClickEdit = (subscription) => {
    this.setState({ subscription });
  }

  onCancelEdit = () => {
    this.setState({ subscription: null });
  }

  onSaveSubscription = (subscription, data) => {
    this.props.onSaveSubscription(subscription, data, this.onSaveSuccessfully);
  };

  onSaveSuccessfully = (response) => {
    if (response) {
      this.setState({ subscription: null });
    }
  }

  render() {
    const { subscription } = this.state;
    if (!subscription) {
      return (<SubscriptionsList {...this.props} onClickEdit={this.onClickEdit} />);
    }
    return (
      <Subscription
        {...this.props}
        subscription={subscription}
        onSave={this.onSaveSubscription}
        onCancel={this.onCancelEdit}
      />
    );
  }

}
