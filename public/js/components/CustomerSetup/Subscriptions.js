import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import SubscriptionsList from './SubscriptionsList';
import Subscription from './Subscription';


export default class Subscriptions extends Component {

  static propTypes = {
    aid: PropTypes.number.isRequired,
    items: PropTypes.instanceOf(Immutable.List),
    settings: PropTypes.instanceOf(Immutable.List),
    allPlans: PropTypes.instanceOf(Immutable.List),
    allServices: PropTypes.instanceOf(Immutable.List),
    onSaveSubscription: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: Immutable.List(),
    settings: Immutable.List(),
    allPlans: Immutable.List(),
    allServices: Immutable.List(),
  };

  state = {
    subscription: null,
  }

  onClickEdit = (subscription) => {
    this.setState({ subscription });
  }

  onClickNew = (aid) => {
    this.setState({ subscription: Immutable.Map({ aid }) });
  }

  onClickCancel = () => {
    this.setState({ subscription: null });
  }

  onClickSave = (subscription, mode) => {
    this.props.onSaveSubscription(subscription, mode).then(this.afterSave);
  };

  afterSave = (response) => {
    if (response) {
      this.setState({ subscription: null });
    }
  }

  render() {
    const { aid, items, settings, allPlans, allServices } = this.props;
    const { subscription } = this.state;
    if (!subscription) {
      return (
        <SubscriptionsList
          items={items}
          settings={settings}
          aid={aid}
          onNew={this.onClickNew}
          onClickEdit={this.onClickEdit}
        />
      );
    }
    return (
      <Subscription
        settings={settings}
        allPlans={allPlans}
        allServices={allServices}
        subscription={subscription}
        onSave={this.onClickSave}
        onCancel={this.onClickCancel}
      />
    );
  }

}
