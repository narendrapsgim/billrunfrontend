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
  getSubscriptionsByAidQuery,
  getPlansKeysQuery,
  getServicesKeysQuery,
  getPaymentGatewaysQuery,
} from '../../common/ApiQueries';
import {
  saveSubscription,
  saveCustomer,
  updateCustomerField,
  clearCustomer,
  getCustomer,
  getSubscription,
} from '../../actions/customerActions';
import { clearItems } from '../../actions/entityListActions';
import { getList, clearList } from '../../actions/listActions';
import { getSettings } from '../../actions/settingsActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import { showSuccess } from '../../actions/alertsActions';
import { modeSelector, itemSelector, idSelector, tabSelector } from '../../selectors/entitySelector';


class CustomerSetup extends Component {

  static propTypes = {
    itemId: PropTypes.string,
    aid: PropTypes.number,
    mode: PropTypes.string,
    customer: PropTypes.instanceOf(Immutable.Map),
    subscription: PropTypes.instanceOf(Immutable.Map),
    settings: PropTypes.instanceOf(Immutable.Map),
    subscriptions: PropTypes.instanceOf(Immutable.List),
    plans: PropTypes.instanceOf(Immutable.List),
    services: PropTypes.instanceOf(Immutable.List),
    gateways: PropTypes.instanceOf(Immutable.List),
    defaultSubsctiptionListFields: PropTypes.array,
    activeTab: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
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
    subscriptions: Immutable.List(),
    gateways: Immutable.List(),
    plans: Immutable.List(),
    services: Immutable.List(),
    defaultSubsctiptionListFields: ['sid', 'firstname', 'lastname', 'plan', 'plan_activation', 'services', 'address'],
  };

  componentWillMount() {
    this.props.dispatch(getSettings('subscribers'));
  }

  componentDidMount() {
    const { itemId } = this.props;
    if (itemId) {
      this.props.dispatch(setPageTitle('Edit Customer'));
      this.props.dispatch(getCustomer(itemId))
      .then((response) => {
        if (response.status) {
          const listFields = this.getSubsctiptionListProject();
          this.props.dispatch(getList('subscriptions', getSubscriptionsByAidQuery(this.props.aid, listFields)));
        }
      });
      this.props.dispatch(getList('available_gateways', getPaymentGatewaysQuery()));
      this.props.dispatch(getList('available_plans', getPlansKeysQuery()));
      this.props.dispatch(getList('available_services', getServicesKeysQuery()));
    } else {
      this.props.dispatch(setPageTitle('Create New Customer'));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { customer: oldItem } = this.props;
    const { customer: item, mode } = nextProps;
    if (mode !== 'create') {
      if (oldItem.getIn(['_id', '$id'], null) === null && item.getIn(['_id', '$id'], null) !== null) {
        const firstName = this.getFirstName(item);
        const lastName = this.getLastName(item);
        const newTitle = `Edit Customer - ${firstName} ${lastName}`;
        this.props.dispatch(setPageTitle(newTitle));
      }
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearCustomer());
    this.props.dispatch(clearList('available_gateways'));
    this.props.dispatch(clearList('available_plans'));
    this.props.dispatch(clearList('available_services'));
  }

  onChangeCustomerField = (e) => {
    const { value, id } = e.target;
    this.props.dispatch(updateCustomerField(id, value));
  }

  afterSaveCustomer = (response) => {
    const { mode } = this.props;
    if (response.status) {
      this.props.dispatch(clearItems('customers')); // refetch items list because item was (changed in / added to) list
      const action = (mode === 'create') ? 'created' : 'updated';
      this.props.dispatch(showSuccess(`Customer was ${action}`));
      this.onBack();
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
    const { aid } = this.props;
    if (response.status) {
      this.props.dispatch(showSuccess('Customer was updated'));
      const listFields = this.getSubsctiptionListProject();
      this.props.dispatch(getList('subscriptions', getSubscriptionsByAidQuery(aid, listFields)));
      return true;
    }
    return false;
  }

  onBack = () => {
    this.props.router.push('/customers');
  }

  getSubscription = id => this.props.dispatch(getSubscription(id))
    .then((response) => {
      if (response.status) {
        return this.props.subscription;
      }
      return null;
    });

  getSubsctiptionListProject = () => {
    const { settings, defaultSubsctiptionListFields } = this.props;
    return Immutable.Map().withMutations((fieldsWithMutations) => {
      fieldsWithMutations.set('from', 1);
      fieldsWithMutations.set('to', 1);
      fieldsWithMutations.set('revision_info', 1);
      settings
        .getIn(['subscriber', 'fields'], Immutable.List())
        .filter(field => (field.get('show_in_list', false) || defaultSubsctiptionListFields.includes(field.get('field_name', ''))))
        .forEach((field) => {
          fieldsWithMutations.set(field.get('field_name', ''), 1);
        });
    }).toJS();
  }

  getFirstName = item => item.get('first_name', item.get('firstname', ''));

  getLastName = item => item.get('last_name', item.get('lastname', ''));

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
      subscriptions,
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
      return (<LoadingItemPlaceholder onClick={this.onBack} />);
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
                <Tab title="Subscriptions" eventKey={2}>
                  <Panel style={{ borderTop: 'none' }}>
                    <Subscriptions
                      items={subscriptions}
                      aid={aid}
                      settings={subscriberFields}
                      allPlans={plans}
                      allServices={services}
                      onSaveSubscription={this.onSaveSubscription}
                      defaultListFields={defaultSubsctiptionListFields}
                      getSubscription={this.getSubscription}
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
          <ActionButtons onClickSave={this.onSaveCustomer} onClickCancel={this.onBack} />
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
  subscriptions: state.list.get('subscriptions') || undefined,
  plans: state.list.get('available_plans') || undefined,
  services: state.list.get('available_services') || undefined,
  gateways: state.list.get('available_gateways') || undefined,
});

export default withRouter(connect(mapStateToProps)(CustomerSetup));
