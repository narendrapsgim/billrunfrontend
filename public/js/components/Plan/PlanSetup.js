import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Col, Panel, Tabs, Tab } from 'react-bootstrap';
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
} from '../../actions/planActions';
import { buildPageTitle, getItemDateValue } from '../../common/Util';
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
  }

  componentWillMount() {
    const { itemId } = this.props;
    if (itemId) {
      this.props.dispatch(getPlan(itemId)).then(this.afterItemReceived);
    }
  }

  componentDidMount() {
    const { mode } = this.props;
    if (mode === 'create') {
      const pageTitle = buildPageTitle(mode, 'plan');
      this.props.dispatch(setPageTitle(pageTitle));
    }
    this.initDefaultValues();
  }


  componentWillReceiveProps(nextProps) {
    const { item, mode, itemId } = nextProps;
    const { item: oldItem, itemId: oldItemId, mode: oldMode } = this.props;
    if (mode !== oldMode || oldItem.get('name') !== item.get('name')) {
      const pageTitle = buildPageTitle(mode, 'plan', item);
      this.props.dispatch(setPageTitle(pageTitle));
    }
    if (itemId !== oldItemId) {
      this.props.dispatch(getPlan(itemId)).then(this.initDefaultValues);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearPlan());
    this.props.dispatch(clearEntity('planOriginal'));
  }

  initDefaultValues = () => {
    const { mode, item } = this.props;
    if (mode === 'create' || (mode === 'closeandnew' && getItemDateValue(item, 'from').isBefore(moment()))) {
      const defaultFromValue = moment().add(1, 'days').toISOString();
      this.props.dispatch(onPlanFieldUpdate(['from'], defaultFromValue));
    }
    if (mode === 'create') {
      this.props.dispatch(onPlanFieldUpdate(['connection_type'], 'postpaid'));
    }
  }

  initRevisions = () => {
    const { item, revisions } = this.props;
    if (revisions.isEmpty() && item.getIn(['_id', '$id'], false)) {
      const key = item.get('name', '');
      this.props.dispatch(getRevisions('plans', 'name', key));
    }
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

  onGroupAdd = (groupName, usage, value, shared, products) => {
    this.props.dispatch(onGroupAdd(groupName, usage, value, shared, products));
  }

  onGroupRemove = (groupName) => {
    this.props.dispatch(onGroupRemove(groupName));
  }

  handleSave = () => {
    const { item, mode } = this.props;
    this.props.dispatch(savePlan(item, mode)).then(this.afterSave);
  }

  afterSave = (response) => {
    const { mode, item } = this.props;
    if (response.status) {
      const key = item.get('name', '');
      this.props.dispatch(clearRevisions('plans', key)); // refetch items list because item was (changed in / added to) list
      const action = (mode === 'create') ? 'created' : 'updated';
      this.props.dispatch(showSuccess(`The plan was ${action}`));
      this.handleBack(true);
    }
  }

  handleBack = (itemWasChanged = false) => {
    if (itemWasChanged) {
      this.props.dispatch(clearItems('plans')); // refetch items list because item was (changed in / added to) list
    }
    this.props.router.push('/plans');
  }

  handleSelectTab = (key) => {
    this.setState({ activeTab: key });
  }

  render() {
    const { item, mode, revisions } = this.props;

    // in update mode wait for plan before render edit screen
    if (mode !== 'create' && typeof item.getIn(['_id', '$id']) === 'undefined') {
      return (<LoadingItemPlaceholder onClick={this.handleBack} />);
    }

    const allowEdit = mode !== 'view';
    const planRates = item.get('rates', Immutable.Map());
    const includeGroups = item.getIn(['include', 'groups'], Immutable.Map());
    return (
      <Col lg={12}>

        <Panel>
          <EntityRevisionDetails
            revisions={revisions}
            item={item}
            mode={mode}
            onChangeFrom={this.onChangeFieldValue}
            itemName="plan"
            backToList={this.handleBack}
          />
        </Panel>

        <Tabs defaultActiveKey={this.state.activeTab} animation={false} id="SettingsTab" onSelect={this.handleSelectTab}>
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
        />
      </Col>
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
