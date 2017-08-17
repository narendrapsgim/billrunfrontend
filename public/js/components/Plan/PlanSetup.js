import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Panel, Tabs, Tab } from 'react-bootstrap';
import Immutable from 'immutable';
import moment from 'moment';
import PlanTab from './PlanTab';
import { EntityRevisionDetails } from '../Entity';
import PlanProductsPriceTab from './PlanProductsPriceTab';
import PlanIncludesTab from './PlanIncludesTab';
import { LoadingItemPlaceholder, ActionButtons } from '../Elements';
import {
  getPlan,
  savePlan,
  clearPlan,
  onPlanFieldUpdate,
  onPlanCycleUpdate,
  onPlanTariffAdd,
  onPlanTariffRemove,
  onGroupAdd,
  onGroupRemove,
  setClonePlan,
} from '../../actions/planActions';
import {
  buildPageTitle,
  getConfig,
  getItemId,
} from '../../common/Util';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import { gotEntity, clearEntity } from '../../actions/entityActions';
import { clearItems, getRevisions, clearRevisions } from '../../actions/entityListActions';
import { showSuccess } from '../../actions/alertsActions';
import { modeSelector, itemSelector, idSelector, tabSelector, revisionsSelector } from '../../selectors/entitySelector';


class PlanSetup extends Component {

  static propTypes = {
    itemId: PropTypes.string,
    item: PropTypes.instanceOf(Immutable.Map),
    revisions: PropTypes.instanceOf(Immutable.List),
    mode: PropTypes.string,
    activeTab: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    item: Immutable.Map(),
    revisions: Immutable.List(),
    activeTab: 1,
  };

  state = {
    activeTab: parseInt(this.props.activeTab),
    progress: false,
  }

  componentWillMount() {
    this.fetchItem();
  }

  componentDidMount() {
    const { mode } = this.props;
    if (['clone', 'create'].includes(mode)) {
      const pageTitle = buildPageTitle(mode, 'plan');
      this.props.dispatch(setPageTitle(pageTitle));
    }
    this.initDefaultValues();
  }


  componentWillReceiveProps(nextProps) {
    const { item, itemId, mode } = nextProps;
    const { item: oldItem, itemId: oldItemId, mode: oldMode } = this.props;
    if (mode !== oldMode || getItemId(item) !== getItemId(oldItem)) {
      const pageTitle = buildPageTitle(mode, 'plan', item);
      this.props.dispatch(setPageTitle(pageTitle));
    }
    if (itemId !== oldItemId || (mode !== oldMode && mode === 'clone')) {
      this.fetchItem(itemId);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(this.props.item, nextState.item)
      || !Immutable.is(this.props.revisions, nextState.revisions)
      || this.props.activeTab !== nextProps.activeTab
      || this.props.itemId !== nextProps.itemId
      || this.props.mode !== nextProps.mode;
  }

  componentWillUnmount() {
    this.props.dispatch(clearPlan());
    this.props.dispatch(clearEntity('planOriginal'));
  }

  initDefaultValues = () => {
    const { mode, item } = this.props;
    if (mode === 'create') {
      const defaultFromValue = moment().add(1, 'days').toISOString();
      this.props.dispatch(onPlanFieldUpdate(['from'], defaultFromValue));
      this.props.dispatch(onPlanFieldUpdate(['connection_type'], 'postpaid'));
    }
    if (mode === 'clone') {
      this.props.dispatch(setClonePlan());
      this.handleSelectTab(1);
    }
    if (item.get('prorated', null) === null) {
      this.props.dispatch(onPlanFieldUpdate(['prorated'], true));
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

  onChangeFieldValue = (path, value) => {
    this.props.dispatch(onPlanFieldUpdate(path, value));
  }

  onDeleteField = (path, value) => {
    this.props.dispatch(onPlanFieldUpdate(path, value));
  }

  onPlanCycleUpdate = (index, value) => {
    this.props.dispatch(onPlanCycleUpdate(index, value));
  }

  onPlanTariffAdd = (trail) => {
    this.props.dispatch(onPlanTariffAdd(trail));
  }

  onPlanTariffRemove = (index) => {
    this.props.dispatch(onPlanTariffRemove(index));
  }

  onGroupAdd = (groupName, usage, unit, value, shared, pooled, products) => {
    this.props.dispatch(onGroupAdd(groupName, usage, unit, value, shared, pooled, products));
  }

  onGroupRemove = (groupName) => {
    this.props.dispatch(onGroupRemove(groupName));
  }

  handleSave = () => {
    const { item, mode } = this.props;
    this.setState({ progress: true });
    this.props.dispatch(savePlan(item, mode)).then(this.afterSave);
  }

  afterSave = (response) => {
    const { mode } = this.props;
    this.setState({ progress: false });
    if (response.status) {
      const action = (['clone', 'create'].includes(mode)) ? 'created' : 'updated';
      this.props.dispatch(showSuccess(`The plan was ${action}`));
      this.clearRevisions();
      this.handleBack(true);
    }
  }

  handleBack = (itemWasChanged = false) => {
    if (itemWasChanged) {
      this.props.dispatch(clearItems('plans')); // refetch items list because item was (changed in / added to) list
    }
    const listUrl = getConfig(['systemItems', 'plan', 'itemsType'], '');
    this.props.router.push(`/${listUrl}`);
  }

  handleSelectTab = (key) => {
    this.setState({ activeTab: key });
  }

  render() {
    const { progress, activeTab } = this.state;
    const { item, mode, revisions } = this.props;
    if (mode === 'loading') {
      return (<LoadingItemPlaceholder onClick={this.handleBack} />);
    }

    const allowEdit = mode !== 'view';
    const planRates = item.get('rates', Immutable.Map());
    const includeGroups = item.getIn(['include', 'groups'], Immutable.Map());
    return (
      <div className="PlanSetup">

        <Panel>
          <EntityRevisionDetails
            itemName="plan"
            revisions={revisions}
            item={item}
            mode={mode}
            onChangeFrom={this.onChangeFieldValue}
            backToList={this.handleBack}
            reLoadItem={this.fetchItem}
            clearRevisions={this.clearRevisions}
          />
        </Panel>

        <Tabs activeKey={activeTab} animation={false} id="PlanTab" onSelect={this.handleSelectTab}>
          <Tab title="Details" eventKey={1}>
            <Panel style={{ borderTop: 'none' }}>
              <PlanTab
                mode={mode}
                plan={item}
                onChangeFieldValue={this.onChangeFieldValue}
                onPlanCycleUpdate={this.onPlanCycleUpdate}
                onPlanTariffAdd={this.onPlanTariffAdd}
                onPlanTariffRemove={this.onPlanTariffRemove}
              />
            </Panel>
          </Tab>

          <Tab title="Override Product Price" eventKey={2}>
            <Panel style={{ borderTop: 'none' }}>
              <PlanProductsPriceTab
                mode={mode}
                planRates={planRates}
                onChangeFieldValue={this.onChangeFieldValue}
              />
            </Panel>
          </Tab>

          <Tab title="Plan Includes" eventKey={3}>
            <Panel style={{ borderTop: 'none' }}>
              <PlanIncludesTab
                mode={mode}
                includeGroups={includeGroups}
                onChangeFieldValue={this.onChangeFieldValue}
                onGroupAdd={this.onGroupAdd}
                onGroupRemove={this.onGroupRemove}
              />
            </Panel>
          </Tab>

        </Tabs>
        <ActionButtons
          onClickCancel={this.handleBack}
          onClickSave={this.handleSave}
          hideSave={!allowEdit}
          cancelLabel={allowEdit ? undefined : 'Back'}
          progress={progress}
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
});
export default withRouter(connect(mapStateToProps)(PlanSetup));
