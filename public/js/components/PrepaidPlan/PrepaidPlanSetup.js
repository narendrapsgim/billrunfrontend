import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { List, Map } from 'immutable';
import { Tabs, Tab, Col, Panel, Button } from 'react-bootstrap';
import PrepaidPlanDetails from './PrepaidPlanDetails';
import PlanNotifications from './PlanNotifications';
import BlockedProducts from './BlockedProducts';
import PlanProductsPriceTab from '../Plan/PlanProductsPriceTab';
import Thresholds from './Thresholds';
import LoadingItemPlaceholder from '../Elements/LoadingItemPlaceholder';
import { getPPIncludesQuery } from '../../common/ApiQueries';
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


class PrepaidPlanSetup extends Component {

  static defaultProps = {
    plan: Map(),
    ppIncludes: List(),
  };

  static propTypes = {
    planId: PropTypes.string,
    action: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    plan: PropTypes.instanceOf(Map),
    ppIncludes: PropTypes.instanceOf(List),
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired,
    }).isRequired,
  }

  componentWillMount() {
    const { planId } = this.props;
    if (planId) {
      this.props.dispatch(getPlan(planId)).then(this.setOriginItem);
    }
  }

  componentDidMount() {
    const { action } = this.props;
    if (action === 'new') {
      this.props.dispatch(setPageTitle('Create New Prepaid Plan'));
      this.props.dispatch(onPlanFieldUpdate(['connection_type'], 'prepaid'));
      this.props.dispatch(onPlanFieldUpdate(['charging_type'], 'prepaid'));
      this.props.dispatch(onPlanFieldUpdate(['type'], 'customer'));
      this.props.dispatch(onPlanFieldUpdate(['price'], 0));
      this.props.dispatch(onPlanFieldUpdate(['upfront'], true));
      this.props.dispatch(onPlanFieldUpdate(['recurrence'], Map({ unit: 1, periodicity: 'month' })));
    }
    this.props.dispatch(getList('pp_includes', getPPIncludesQuery()));
  }

  componentWillReceiveProps(nextProps) {
    const { plan: oldPlan, action } = this.props;
    const { plan } = nextProps;
    if (action !== 'new' && plan.get('name') && plan.get('name') !== oldPlan.get('name')) {
      this.props.dispatch(setPageTitle(`Edit Prepaid Plan - ${plan.get('name')}`));
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
    const { plan, dispatch } = this.props;
    if (plan.getIn(['notifications_threshold', ppInclude], List()).size) {
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
    const { plan, dispatch } = this.props;
    if (plan.get('disallowed_rates', List()).includes(productKey)) {
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
    const { plan, dispatch } = this.props;
    if (plan.getIn(['pp_threshold', balanceId])) {
      dispatch(showWarning('Prepaid bucket already defined'));
    } else {
      dispatch(addBalanceThreshold(balanceId));
    }
  };

  afterSave = (response) => {
    const { action } = this.props;
    if (response.status && action === 'new') {
      this.handleBack();
    } else if (response.status && action !== 'new') {
      this.handleBack();
    }
  }

  handleSave = () => {
    const { plan, action } = this.props;
    this.props.dispatch(savePlan(plan, action)).then(this.afterSave);
  };

  handleBack = () => {
    this.props.router.push('/prepaid_plans');
  };

  render() {
    const { plan, ppIncludes, action } = this.props;

    // in update mode wait for plan before render edit screen
    if (action === 'update' && typeof plan.getIn(['_id', '$id']) === 'undefined') {
      return (<LoadingItemPlaceholder onClick={this.handleBack} />);
    }

    return (
      <div className="PrepaidPlan">
        <Col lg={12}>
          <Tabs defaultActiveKey={1} animation={false} id="PrepaidPlan" onSelect={this.handleSelectTab}>

            <Tab title="Details" eventKey={1}>
              <Panel style={{ borderTop: 'none' }}>
                <PrepaidPlanDetails
                  item={plan}
                  mode={action}
                  onChangePlanField={this.onChangePlanField}
                />
              </Panel>
            </Tab>

            <Tab title="Override Product Price" eventKey={2}>
              <Panel style={{ borderTop: 'none' }}>
                <PlanProductsPriceTab plan={plan} />
              </Panel>
            </Tab>

            <Tab title="Notifications" eventKey={3}>
              <Panel style={{ borderTop: 'none' }}>
                <PlanNotifications
                  plan={plan}
                  pp_includes={ppIncludes}
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
                  plan={plan}
                  onSelectProduct={this.onSelectBlockProduct}
                  onRemoveProduct={this.onRemoveBlockProduct}
                />
              </Panel>
            </Tab>

            <Tab title="Charging Limits" eventKey={5}>
              <Panel style={{ borderTop: 'none' }}>
                <Thresholds
                  plan={plan}
                  pp_includes={ppIncludes}
                  onChangeThreshold={this.onChangeThreshold}
                  onAddBalance={this.onAddBalanceThreshold}
                />
              </Panel>
            </Tab>
          </Tabs>

          <div style={{ marginTop: 12 }}>
            <Button onClick={this.handleSave} bsStyle="primary" style={{ marginRight: 10 }} >Save</Button>
            <Button onClick={this.handleBack} bsStyle="default">Cancel</Button>
          </div>

        </Col>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { planId, action } = props.location.query;
  const plan = state.plan;
  const ppIncludes = state.list.get('pp_includes');
  return { action, planId, plan, ppIncludes };
};

export default withRouter(connect(mapStateToProps)(PrepaidPlanSetup));
