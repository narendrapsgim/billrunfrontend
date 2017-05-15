import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import Immutable from 'immutable';
import { Tabs, Tab, Panel } from 'react-bootstrap';
import PrepaidPlanDetails from './PrepaidPlanDetails';
import PlanNotifications from './PlanNotifications';
import BlockedProducts from './BlockedProducts';
import Thresholds from './Thresholds';
import { EntityRevisionDetails } from '../Entity';
import { ActionButtons, LoadingItemPlaceholder } from '../Elements';
import PlanProductsPriceTab from '../Plan/PlanProductsPriceTab';
import {
  buildPageTitle,
  getConfig,
  getItemId,
  getItemMinFromDate,
} from '../../common/Util';
import { modeSelector, itemSelector, idSelector, tabSelector, revisionsSelector } from '../../selectors/entitySelector';
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
  removeBalanceThreshold,
} from '../../actions/prepaidPlanActions';
import { getList } from '../../actions/listActions';
import { showWarning, showSuccess } from '../../actions/alertsActions';
import {
  getPlan,
  savePlan,
  clearPlan,
  onPlanFieldUpdate,
  onPlanTariffAdd,
  setClonePlan,
} from '../../actions/planActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import { gotEntity, clearEntity } from '../../actions/entityActions';
import { clearItems, getRevisions, clearRevisions } from '../../actions/entityListActions';
import { chargingDaySelector } from '../../selectors/settingsSelector';


class PrepaidPlanSetup extends Component {

  static propTypes = {
    itemId: PropTypes.string,
    item: PropTypes.instanceOf(Immutable.Map),
    revisions: PropTypes.instanceOf(Immutable.List),
    mode: PropTypes.string,
    chargingDay: PropTypes.number,
    ppIncludes: PropTypes.instanceOf(Immutable.List),
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
    item: Immutable.Map(),
    revisions: Immutable.List(),
    ppIncludes: Immutable.List(),
    activeTab: 1,
  };

  state = {
    activeTab: parseInt(this.props.activeTab),
  }

  componentWillMount() {
    this.fetchItem();
  }

  componentDidMount() {
    const { mode } = this.props;
    if (['clone', 'create'].includes(mode)) {
      const pageTitle = buildPageTitle(mode, 'prepaid_plan');
      this.props.dispatch(setPageTitle(pageTitle));
    }
    this.initDefaultValues();
    this.props.dispatch(getList('pp_includes', getPrepaidIncludesQuery()));
  }

  componentWillReceiveProps(nextProps) {
    const { item, mode, itemId } = nextProps;
    const { item: oldItem, itemId: oldItemId, mode: oldMode } = this.props;
    if (mode !== oldMode || getItemId(item) !== getItemId(oldItem)) {
      const pageTitle = buildPageTitle(mode, 'prepaid_plan', item);
      this.props.dispatch(setPageTitle(pageTitle));
    }
    if (itemId !== oldItemId || (mode !== oldMode && mode === 'clone')) {
      this.fetchItem(itemId);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearPlan());
    this.props.dispatch(clearEntity('planOriginal'));
  }

  initDefaultValues = () => {
    const { mode } = this.props;
    if (mode === 'create') {
      const defaultFromValue = moment().add(1, 'days').toISOString();
      this.props.dispatch(onPlanFieldUpdate(['from'], defaultFromValue));
      this.props.dispatch(onPlanFieldUpdate(['connection_type'], 'prepaid'));
      this.props.dispatch(onPlanFieldUpdate(['charging_type'], 'prepaid'));
      this.props.dispatch(onPlanFieldUpdate(['type'], 'customer'));
      this.props.dispatch(onPlanTariffAdd());
      this.props.dispatch(onPlanFieldUpdate(['price', 0, 'price'], 0));
      this.props.dispatch(onPlanFieldUpdate(['upfront'], true));
      this.props.dispatch(onPlanFieldUpdate(['recurrence'], Immutable.Map({ unit: 1, periodicity: 'month' })));
      this.props.dispatch(onPlanFieldUpdate(['prorated'], false)); // this is a temp hack, because prepaid plans should not have prorated field. needs to be fixed in BE
      this.props.dispatch(onPlanFieldUpdate(['tax'], Immutable.Map({ service_code: ' ', product_code: ' ', safe_harbor_override_pct: ' ' }))); // this is a temp hack, because prepaid plans should not have tax fields. needs to be fixed in BE
    }
    if (mode === 'clone') {
      this.props.dispatch(setClonePlan());
    }
  }

  initRevisions = () => {
    const { item, revisions } = this.props;
    if (revisions.isEmpty() && getItemId(item, false)) {
      const key = item.get('name', '');
      this.props.dispatch(getRevisions('plans', 'name', key));
    }
  }

  fetchItem = (itemId = this.props.itemId) => {
    if (itemId) {
      this.props.dispatch(getPlan(itemId)).then(this.afterItemReceived);
    }
  }

  clearRevisions = () => {
    const { item } = this.props;
    const key = item.get('name', '');
    this.props.dispatch(clearRevisions('plans', key)); // refetch items list because item was (changed in / added to) list
  }

  afterItemReceived = (response) => {
    if (response.status) {
      this.initRevisions();
      this.initDefaultValues();
      this.props.dispatch(gotEntity('planOriginal', response.data[0]));
    } else {
      this.handleBack();
    }
  }

  onChangePlanField = (path, value) => {
    this.props.dispatch(onPlanFieldUpdate(path, value));
  }

  onSelectBalance = (ppInclude) => {
    const { item, dispatch } = this.props;
    if (item.getIn(['notifications_threshold', ppInclude], Immutable.List()).size) {
      dispatch(showWarning('There are already notifications for selected prepaid bucket'));
      return;
    }
    dispatch(addBalanceNotifications(ppInclude));
  }

  onAddNotification = (thresholdId) => {
    this.props.dispatch(addNotification(thresholdId));
  }

  onRemoveNotification = (thresholdId, index) => {
    this.props.dispatch(removeNotification(thresholdId, index));
  }

  onUpdateNotificationField = (thresholdId, index, field, value) => {
    this.props.dispatch(updateNotificationField(thresholdId, index, field, value));
  }

  onRemoveBalanceNotifications = (balanceId) => {
    this.props.dispatch(removeBalanceNotifications(balanceId));
  }


  onChangeBlockProduct = (productKeys) => {
    const productKeysList = (productKeys.length) ? productKeys.split(',') : [];
    this.props.dispatch(blockProduct(Immutable.List(productKeysList)));
  }

  onChangeThreshold = (balanceId, threshold) => {
    this.props.dispatch(changeBalanceThreshold(balanceId, threshold));
  }

  onRemoveThreshold = (balanceId) => {
    this.props.dispatch(removeBalanceThreshold(balanceId));
  }

  onAddBalanceThreshold = (balanceId) => {
    const { item, dispatch } = this.props;
    if (item.getIn(['pp_threshold', balanceId])) {
      dispatch(showWarning('Prepaid bucket already defined'));
    } else {
      dispatch(addBalanceThreshold(balanceId));
    }
  }

  handleSave = () => {
    const { item, mode } = this.props;
    this.props.dispatch(savePlan(item, mode)).then(this.afterSave);
  }

  afterSave = (response) => {
    const { mode } = this.props;
    if (response.status) {
      const action = (['clone', 'create'].includes(mode)) ? 'created' : 'updated';
      this.props.dispatch(showSuccess(`The plan was ${action}`));
      this.clearRevisions();
      this.handleBack(true);
    }
  }

  handleBack = (itemWasChanged = false) => {
    if (itemWasChanged) {
      this.props.dispatch(clearItems('prepaid_plans')); // refetch items list because item was (changed in / added to) list
    }
    const listUrl = getConfig(['systemItems', 'prepaid_plan', 'itemsType'], '');
    this.props.router.push(`/${listUrl}`);
  }

  handleSelectTab = (key) => {
    this.setState({ activeTab: key });
  }

  render() {
    const { item, mode, ppIncludes, revisions, chargingDay } = this.props;
    if (mode === 'loading') {
      return (<LoadingItemPlaceholder onClick={this.handleBack} />);
    }

    const allowEdit = mode !== 'view';
    const planRates = item.get('rates', Immutable.Map());
    const minFrom = getItemMinFromDate(item, chargingDay);
    return (
      <div className="PrepaidPlan">

        <Panel>
          <EntityRevisionDetails
            itemName="prepaid_plan"
            revisions={revisions}
            item={item}
            mode={mode}
            onChangeFrom={this.onChangePlanField}
            backToList={this.handleBack}
            reLoadItem={this.fetchItem}
            clearRevisions={this.clearRevisions}
            minFrom={minFrom}
          />
        </Panel>

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
                mode={mode}
                planRates={planRates}
                onChangeFieldValue={this.onChangePlanField}
              />
            </Panel>
          </Tab>

          <Tab title="Notifications" eventKey={3}>
            <Panel style={{ borderTop: 'none' }}>
              <PlanNotifications
                plan={item}
                mode={mode}
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
                mode={mode}
                onChangeBlockProduct={this.onChangeBlockProduct}
              />
            </Panel>
          </Tab>

          <Tab title="Charging Limits" eventKey={5}>
            <Panel style={{ borderTop: 'none' }}>
              <Thresholds
                plan={item}
                mode={mode}
                ppIncludes={ppIncludes}
                onChangeThreshold={this.onChangeThreshold}
                onRemoveThreshold={this.onRemoveThreshold}
                onAddBalance={this.onAddBalanceThreshold}
              />
            </Panel>
          </Tab>
        </Tabs>
        <ActionButtons
          onClickCancel={this.handleBack}
          onClickSave={this.handleSave}
          hideSave={!allowEdit}
          cancelLabel={allowEdit ? undefined : 'Back'}
        />
      </div>
    );
  }
}


const mapStateToProps = (state, props) => ({
  itemId: idSelector(state, props, 'plan'),
  item: itemSelector(state, props, 'plan'),
  mode: modeSelector(state, props, 'plan'),
  activeTab: tabSelector(state, props, 'plan'),
  revisions: revisionsSelector(state, props, 'plan'),
  ppIncludes: state.list.get('pp_includes'),
  chargingDay: chargingDaySelector(state, props),
});
export default withRouter(connect(mapStateToProps)(PrepaidPlanSetup));
