import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import SubscriptionsList from './SubscriptionsList';
import Subscription from './Subscription';
import { getItemId } from '../../common/Util';


export default class Subscriptions extends Component {

  static propTypes = {
    aid: PropTypes.number.isRequired,
    items: PropTypes.instanceOf(Immutable.List),
    settings: PropTypes.instanceOf(Immutable.List),
    allPlans: PropTypes.instanceOf(Immutable.List),
    allServices: PropTypes.instanceOf(Immutable.List),
    defaultListFields: PropTypes.arrayOf(PropTypes.string),
    onSaveSubscription: PropTypes.func.isRequired,
    getSubscription: PropTypes.func.isRequired,
    clearRevisions: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: Immutable.List(),
    settings: Immutable.List(),
    allPlans: Immutable.List(),
    allServices: Immutable.List(),
    defaultListFields: [],
  };

  state = {
    subscription: null,
  }

  fetchSubscription = (subscription, name, action) => {
    const id = getItemId(subscription, null);
    if (id !== null) {
      this.props.getSubscription(id, action).then((newSubscription) => {
        this.setState({ subscription: newSubscription });
      });
    }
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
    const { aid, items, settings, allPlans, allServices, defaultListFields } = this.props;
    const { subscription } = this.state;
    if (!subscription) {
      return (
        <SubscriptionsList
          items={items}
          settings={settings}
          aid={aid}
          onNew={this.onClickNew}
          onClickEdit={this.fetchSubscription}
          defaultListFields={defaultListFields}
        />
      );
    }
    return (
      <Subscription
        subscription={subscription}
        settings={settings}
        allPlans={allPlans}
        allServices={allServices}
        clearRevisions={this.props.clearRevisions}
        getSubscription={this.fetchSubscription}
        onSave={this.onClickSave}
        onCancel={this.onClickCancel}
      />
    );
  }

}
