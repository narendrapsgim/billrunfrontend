import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import { Tabs, Tab, Panel } from 'react-bootstrap';
import Customer from './Customer';
import Subscriptions from './Subscriptions';
import ActionButtons from '../Elements/ActionButtons';
import LoadingItemPlaceholder from '../Elements/LoadingItemPlaceholder';
import PostpaidBalances from '../PostpaidBalances';
import PrepaidBalances from '../PrepaidBalances';
import {
  getPlansKeysQuery,
  getServicesKeysWithInfoQuery,
  getPaymentGatewaysQuery,
} from '../../common/ApiQueries';
import {
  saveSubscription,
  saveCustomer,
  updateCustomerField,
  clearCustomer,
  getCustomer,
  getSubscription,
  setCloneSubscription,
} from '../../actions/customerActions';
import { clearItems, getRevisions, clearRevisions, clearList } from '../../actions/entityListActions';
import { getList } from '../../actions/listActions';
import { getSettings } from '../../actions/settingsActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import { showSuccess, showAlert } from '../../actions/alertsActions';
import { modeSelector, itemSelector, idSelector, tabSelector, messageSelector } from '../../selectors/entitySelector';
import { buildPageTitle, getConfig, getItemId } from '../../common/Util';


class CustomerSetup extends Component {

  static propTypes = {
    itemId: PropTypes.string,
    aid: PropTypes.number,
    mode: PropTypes.string,
    customer: PropTypes.instanceOf(Immutable.Map),
    subscription: PropTypes.instanceOf(Immutable.Map),
    settings: PropTypes.instanceOf(Immutable.Map),
    plans: PropTypes.instanceOf(Immutable.List),
    services: PropTypes.instanceOf(Immutable.List),
    gateways: PropTypes.instanceOf(Immutable.List),
    defaultSubsctiptionListFields: PropTypes.array,
    activeTab: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    message: PropTypes.oneOfType([
      PropTypes.object,
      null,
    ]),
    location: PropTypes.shape({
      pathname: PropTypes.string,
      query: PropTypes.object,
    }),
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    activeTab: 1,
    customer: Immutable.Map(),
    subscription: Immutable.Map(),
    settings: Immutable.Map(),
    gateways: Immutable.List(),
    plans: Immutable.List(),
    services: Immutable.List(),
    defaultSubsctiptionListFields: ['sid', 'firstname', 'lastname', 'plan', 'plan_activation', 'services', 'address'],
  };

  componentWillMount() {
    this.fetchItem();
  }

  componentDidMount() {
    const { mode, message } = this.props;
    this.props.dispatch(getSettings(['subscribers']));
    if (message) {
      this.props.dispatch(showAlert(message.content, message.type));
    }
    if (['clone', 'create'].includes(mode)) {
      const pageTitle = buildPageTitle(mode, 'customer');
      this.props.dispatch(setPageTitle(pageTitle));
    } else {
      this.props.dispatch(getList('available_gateways', getPaymentGatewaysQuery()));
      this.props.dispatch(getList('available_plans', getPlansKeysQuery({ name: 1, description: 1, 'include.services': 1 })));
      this.props.dispatch(getList('available_services', getServicesKeysWithInfoQuery()));
    }
  }


  componentWillReceiveProps(nextProps) {
    const { customer, mode, itemId } = nextProps;
    const { customer: oldCustomer, itemId: oldItemId, mode: oldMode } = this.props;
    if (mode !== oldMode || getItemId(customer) !== getItemId(oldCustomer)) {
      const pageTitle = buildPageTitle(mode, 'customer', customer);
      this.props.dispatch(setPageTitle(pageTitle));
    }
    if (itemId !== oldItemId || (mode !== oldMode && mode === 'clone')) {
      this.fetchItem(itemId);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearCustomer());
    this.clearSubscriptions();
  }

  fetchItem = (itemId = this.props.itemId) => {
    if (itemId) {
      this.props.dispatch(getCustomer(itemId)).then(this.afterItemReceived);
    }
  }

  afterItemReceived = (response) => {
    if (response.status) {
      //
    } else {
      this.handleBack();
    }
  }

  onChangeCustomerField = (e) => {
    const { value, id } = e.target;
    this.props.dispatch(updateCustomerField(id, value));
  }

  afterSaveCustomer = (response) => {
    const { mode } = this.props;
    if (response.status) {
      const action = (['clone', 'create'].includes(mode)) ? 'created' : 'updated';
      this.props.dispatch(showSuccess(`The customer was ${action}`));
      this.handleBack(true);
    }
  }

  onSaveCustomer = () => {
    const { customer, mode } = this.props;
    this.props.dispatch(saveCustomer(customer, mode)).then(this.afterSaveCustomer);
  }

  onClickChangePaymentGateway = (aid) => {
    const returnUrlParam = `return_url=${encodeURIComponent(this.getReturnUrl())}`;
    const aidParam = `aid=${encodeURIComponent(aid)}`;
    const action = `action=${encodeURIComponent('updatePaymentGateway')}`;
    window.location = `${globalSetting.serverUrl}/internalpaypage?${aidParam}&${returnUrlParam}&${action}`;
  }

  onSaveSubscription = (subscription, mode) =>
    this.props.dispatch(saveSubscription(subscription, mode)).then(this.afterSaveSubscription);


  afterSaveSubscription = (response) => {
    if (response.status) {
      const action = (['clone', 'create'].includes(response.action)) ? 'created' : 'updated';
      this.props.dispatch(showSuccess(`The subscription was ${action}`));
      this.clearSubscriptionRevisions(response.subscription);
      this.clearSubscriptions();
      return true;
    }
    return false;
  }

  clearSubscriptionRevisions = (subscription) => {
    const sid = subscription.get('sid', '');
    const aid = subscription.get('aid', '');
    this.props.dispatch(clearRevisions('subscribers', [sid, aid]));// refetch items list because item was (changed in / added to) list
  }

  clearSubscriptions = () => {
    this.props.dispatch(clearList('subscribers'));
  }

  handleBack = (itemWasChanged = false) => {
    if (itemWasChanged) {
      this.props.dispatch(clearItems('customers')); // refetch items list because item was (changed in / added to) list
    }
    const listUrl = getConfig(['systemItems', 'customer', 'itemsType'], '');
    this.props.router.push(`/${listUrl}`);
  }

  getSubscription = (id, mode) => this.props.dispatch(getSubscription(id))
    .then((response) => {
      if (response.status) {
        if (mode === 'clone') {
          this.props.dispatch(setCloneSubscription());
          return this.props.subscription;
        }
        const sid = this.props.subscription.get('sid', '');
        const aid = this.props.subscription.get('aid', '');
        this.props.dispatch(getRevisions('subscribers', ['sid', 'aid'], [sid, aid]));
        return this.props.subscription;
      }
      return null;
    });

  getReturnUrl = () => {
    const { itemId } = this.props;
    return `${window.location.origin}/#/customers/customer/${itemId}?tab=2`;
  }

  handleSelectTab = (tab) => {
    const { pathname, query } = this.props.location;
    this.props.router.push({
      pathname,
      query: Object.assign({}, query, { tab }),
    });
  }

  render() {
    const {
      customer,
      defaultSubsctiptionListFields,
      settings,
      plans,
      services,
      gateways,
      mode,
      aid,
      activeTab,
    } = this.props;
    const showActionButtons = (activeTab === 1);

    if (mode === 'loading') {
      return (<LoadingItemPlaceholder onClick={this.handleBack} />);
    }

    const accountFields = settings.getIn(['account', 'fields'], Immutable.List());
    const subscriberFields = settings.getIn(['subscriber', 'fields'], Immutable.List());

    return (
      <div className="CustomerSetup">
        <div className="row">
          <div className="col-lg-12">
            <Tabs defaultActiveKey={activeTab} animation={false} id="CustomerEditTabs" onSelect={this.handleSelectTab}>
              { !accountFields.isEmpty() &&
                <Tab title="Customer Details" eventKey={1} key={1}>
                  <Panel style={{ borderTop: 'none' }}>
                    <Customer
                      customer={customer}
                      action={mode}
                      fields={accountFields}
                      supportedGateways={gateways}
                      onChange={this.onChangeCustomerField}
                      onChangePaymentGateway={this.onClickChangePaymentGateway}
                    />
                  </Panel>
                </Tab>
              }

              { (mode !== 'create') && !subscriberFields.isEmpty() &&
                <Tab title="Subscribers" eventKey={2}>
                  <Panel style={{ borderTop: 'none' }}>
                    <Subscriptions
                      aid={aid}
                      settings={subscriberFields}
                      allPlans={plans}
                      allServices={services}
                      onSaveSubscription={this.onSaveSubscription}
                      defaultListFields={defaultSubsctiptionListFields}
                      getSubscription={this.getSubscription}
                      clearRevisions={this.clearSubscriptionRevisions}
                      clearList={this.clearSubscriptions}
                    />
                  </Panel>
                </Tab>
              }
              { (mode !== 'create') &&
                <Tab title="Postpaid Counters" eventKey={3}>
                  <Panel style={{ borderTop: 'none' }}>
                    <PostpaidBalances aid={aid} />
                  </Panel>
                </Tab>
              }
              { (mode !== 'create') &&
                <Tab title="Prepaid Counters" eventKey={4}>
                  <Panel style={{ borderTop: 'none' }}>
                    <PrepaidBalances aid={aid} />
                  </Panel>
                </Tab>
              }
            </Tabs>
          </div>
        </div>
        { showActionButtons &&
          <ActionButtons onClickSave={this.onSaveCustomer} onClickCancel={this.handleBack} />
        }
      </div>
    );
  }
}


const mapStateToProps = (state, props) => ({
  itemId: idSelector(state, props, 'customer'),
  customer: itemSelector(state, props, 'customer'),
  subscription: itemSelector(state, props, 'subscription'),
  mode: modeSelector(state, props, 'customer'),
  activeTab: tabSelector(state, props),
  aid: state.entity.getIn(['customer', 'aid']) || undefined,
  settings: state.settings.get('subscribers') || undefined,
  plans: state.list.get('available_plans') || undefined,
  services: state.list.get('available_services') || undefined,
  gateways: state.list.get('available_gateways') || undefined,
  message: messageSelector(state, props),
});

export default withRouter(connect(mapStateToProps)(CustomerSetup));
