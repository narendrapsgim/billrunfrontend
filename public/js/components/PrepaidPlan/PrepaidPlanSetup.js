import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { List, Map } from 'immutable';
import { Tabs, Tab, Col, Panel } from 'react-bootstrap';
import ActionButtons from '../Elements/ActionButtons';
import PrepaidPlanDetails from './PrepaidPlanDetails';
import PlanNotifications from './PlanNotifications';
import BlockedProducts from './BlockedProducts';
import PlanProductsPriceTab from '../Plan/PlanProductsPriceTab';
import Thresholds from './Thresholds';
import LoadingItemPlaceholder from '../Elements/LoadingItemPlaceholder';
import { getPrepaidIncludesQuery } from '../../common/ApiQueries';
import {
  addNotification,
  removeNotification,
  updateNotificationField,
  addBalanceNotifications,
  removeBalanceNotifications,
  blockProduct,
  removeBlockProduct,
  addBalanceThreshold,
  changeBalanceThreshold,
} from '../../actions/prepaidPlanActions';
import { getList } from '../../actions/listActions';
import { showWarning } from '../../actions/alertsActions';
import { getPlan, savePlan, clearPlan, onPlanFieldUpdate } from '../../actions/planActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import { gotEntity, clearEntity } from '../../actions/entityActions';
import { clearItems } from '../../actions/entityListActions';


class PrepaidPlanSetup extends Component {

  static propTypes = {
    itemId: PropTypes.string,
    item: PropTypes.instanceOf(Map),
    mode: PropTypes.string,
    ppIncludes: PropTypes.instanceOf(List),
    activeTab: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    item: Map(),
    ppIncludes: List(),
    activeTab: 1,
  };

  state = {
    activeTab: parseInt(this.props.activeTab),
  }

  componentWillMount() {
    const { itemId } = this.props;
    if (itemId) {
      this.props.dispatch(getPlan(itemId)).then(this.setOriginItem);
    }
  }

  componentDidMount() {
    const { mode } = this.props;
    if (mode === 'new') {
      this.props.dispatch(setPageTitle('Create New Prepaid Plan'));
      this.props.dispatch(onPlanFieldUpdate(['connection_type'], 'prepaid'));
      this.props.dispatch(onPlanFieldUpdate(['charging_type'], 'prepaid'));
      this.props.dispatch(onPlanFieldUpdate(['type'], 'customer'));
      this.props.dispatch(onPlanFieldUpdate(['price'], 0));
      this.props.dispatch(onPlanFieldUpdate(['upfront'], true));
      this.props.dispatch(onPlanFieldUpdate(['recurrence'], Map({ unit: 1, periodicity: 'month' })));
    }
    this.props.dispatch(getList('pp_includes', getPrepaidIncludesQuery()));
  }

  componentWillReceiveProps(nextProps) {
    const { item: oldItem, mode } = this.props;
    const { item } = nextProps;
    if (mode !== 'new' && item.get('name') && item.get('name') !== oldItem.get('name')) {
      this.props.dispatch(setPageTitle(`Edit Prepaid Plan - ${item.get('name')}`));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearPlan());
    this.props.dispatch(clearEntity('planOriginal'));
  }

  setOriginItem = (response) => {
    if (response.status) {
      this.props.dispatch(gotEntity('planOriginal', response.data[0]));
    }
  }

  onChangePlanField = (path, value) => {
    this.props.dispatch(onPlanFieldUpdate(path, value));
  }

  onSelectBalance = (ppInclude) => {
    const { item, dispatch } = this.props;
    if (item.getIn(['notifications_threshold', ppInclude], List()).size) {
      dispatch(showWarning('There are already notifications for selected prepaid bucket'));
      return;
    }
    dispatch(addBalanceNotifications(ppInclude));
  };

  onAddNotification = (thresholdId) => {
    this.props.dispatch(addNotification(thresholdId));
  };

  onRemoveNotification = (thresholdId, index) => {
    this.props.dispatch(removeNotification(thresholdId, index));
  };

  onUpdateNotificationField = (thresholdId, index, field, value) => {
    this.props.dispatch(updateNotificationField(thresholdId, index, field, value));
  };

  onRemoveBalanceNotifications = (balanceId) => {
    this.props.dispatch(removeBalanceNotifications(balanceId));
  };

  onSelectBlockProduct = (productKey) => {
    const { item, dispatch } = this.props;
    if (item.get('disallowed_rates', List()).includes(productKey)) {
      dispatch(showWarning(`${productKey} already blocked`));
      return;
    }
    dispatch(blockProduct(productKey));
  };

  onRemoveBlockProduct = (productKey) => {
    this.props.dispatch(removeBlockProduct(productKey));
  };

  onChangeThreshold = (balanceId, threshold) => {
    this.props.dispatch(changeBalanceThreshold(balanceId, threshold));
  };

  onAddBalanceThreshold = (balanceId) => {
    const { item, dispatch } = this.props;
    if (item.getIn(['pp_threshold', balanceId])) {
      dispatch(showWarning('Prepaid bucket already defined'));
    } else {
      dispatch(addBalanceThreshold(balanceId));
    }
  };

  afterSave = (response) => {
    if (response.status) { // on success save new item
      this.props.dispatch(clearItems('prepaid_plans')); // refetch items list because item was (changed in / added to) list
      this.handleBack();
    }
  }

  handleSave = () => {
    const { item, mode } = this.props;
    this.props.dispatch(savePlan(item, mode)).then(this.afterSave);
  };

  handleBack = () => {
    this.props.router.push('/prepaid_plans');
  };

  handleSelectTab = (key) => {
    this.setState({ activeTab: key });
  }

  render() {
    const { item, ppIncludes, mode } = this.props;

    // in update mode wait for plan before render edit screen
    if (mode === 'update' && typeof item.getIn(['_id', '$id']) === 'undefined') {
      return (<LoadingItemPlaceholder onClick={this.handleBack} />);
    }

    const planRates = item.get('rates', Map());

    return (
      <div className="PrepaidPlan">
        <Col lg={12}>
          <Tabs defaultActiveKey={this.state.activeTab} animation={false} id="PrepaidPlan" onSelect={this.handleSelectTab}>

            <Tab title="Details" eventKey={1}>
              <Panel style={{ borderTop: 'none' }}>
                <PrepaidPlanDetails
                  item={item}
                  mode={mode}
                  onChangePlanField={this.onChangePlanField}
                />
              </Panel>
            </Tab>

            <Tab title="Override Product Price" eventKey={2}>
              <Panel style={{ borderTop: 'none' }}>
                <PlanProductsPriceTab
                  planRates={planRates}
                  onChangeFieldValue={this.onChangePlanField}
                />
              </Panel>
            </Tab>

            <Tab title="Notifications" eventKey={3}>
              <Panel style={{ borderTop: 'none' }}>
                <PlanNotifications
                  plan={item}
                  ppIncludes={ppIncludes}
                  onAddNotification={this.onAddNotification}
                  onRemoveNotification={this.onRemoveNotification}
                  onUpdateNotificationField={this.onUpdateNotificationField}
                  onSelectBalance={this.onSelectBalance}
                  onRemoveBalanceNotifications={this.onRemoveBalanceNotifications}
                />
              </Panel>
            </Tab>

            <Tab title="Blocked Products" eventKey={4}>
              <Panel style={{ borderTop: 'none' }}>
                <BlockedProducts
                  plan={item}
                  onSelectProduct={this.onSelectBlockProduct}
                  onRemoveProduct={this.onRemoveBlockProduct}
                />
              </Panel>
            </Tab>

            <Tab title="Charging Limits" eventKey={5}>
              <Panel style={{ borderTop: 'none' }}>
                <Thresholds
                  plan={item}
                  ppIncludes={ppIncludes}
                  onChangeThreshold={this.onChangeThreshold}
                  onAddBalance={this.onAddBalanceThreshold}
                />
              </Panel>
            </Tab>
          </Tabs>

          <ActionButtons onClickCancel={this.handleBack} onClickSave={this.handleSave} />

        </Col>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { tab: activeTab, action } = props.location.query;
  const { itemId } = props.params;
  const mode = action || ((itemId) ? 'update' : 'new');
  const ppIncludes = state.list.get('pp_includes');
  const { plan: item } = state;
  return { itemId, item, mode, ppIncludes, activeTab };
};

export default withRouter(connect(mapStateToProps)(PrepaidPlanSetup));
