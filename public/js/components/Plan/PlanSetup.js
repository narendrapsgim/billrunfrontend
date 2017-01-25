import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { Col, Panel, Tabs, Tab, Button } from 'react-bootstrap';
import Immutable from 'immutable';
import PlanTab from './PlanTab';
import PlanProductsPriceTab from './PlanProductsPriceTab';
import PlanIncludesTab from './PlanIncludesTab';
import LoadingItemPlaceholder from '../Elements/LoadingItemPlaceholder';
import {
  getPlan,
  savePlan,
  clearPlan,
  onGroupAdd,
  onGroupRemove,
  onPlanCycleUpdate,
  onPlanTariffAdd,
  onPlanTariffRemove,
  onPlanFieldUpdate,
} from '../../actions/planActions';
import { addGroupProducts, getGroupProducts, removeGroupProducts } from '../../actions/planGroupsActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import { gotEntity, clearEntity } from '../../actions/entityActions';


class PlanSetup extends Component {

  static defaultProps = {
    item: Immutable.Map(),
    activeTab: 1,
  };

  static propTypes = {
    itemId: PropTypes.string,
    item: PropTypes.instanceOf(Immutable.Map),
    includeGroups: PropTypes.instanceOf(Immutable.Map),
    mode: PropTypes.string,
    activeTab: PropTypes.number,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    addGroupProducts: PropTypes.func.isRequired,
    getGroupProducts: PropTypes.func.isRequired,
    onGroupAdd: PropTypes.func.isRequired,
    onGroupRemove: PropTypes.func.isRequired,
    removeGroupProducts: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

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
      this.props.dispatch(setPageTitle('Create New Plan'));
      this.props.dispatch(onPlanFieldUpdate(['connection_type'], 'postpaid'));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { item: oldItem, mode } = this.props;
    const { item } = nextProps;
    if (mode === 'update' && oldItem.get('name') !== item.get('name')) {
      this.props.dispatch(setPageTitle(`Edit plan - ${item.get('name')}`));
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

  onChangeFieldValue = (path, value) => {
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

  handleSave = () => {
    const { item, mode } = this.props;
    this.props.dispatch(savePlan(item, mode)).then(this.afterSave);
  }
  afterSave = (response) => {
    const { mode } = this.props;
    if (response.status && mode === 'new') {
      this.handleBack();
    } else if (response.status && mode !== 'new') {
      this.handleBack();
    }
  }

  handleBack = () => {
    this.props.router.push('/plans');
  }

  handleSelectTab = (key) => {
    this.setState({ activeTab: key });
  }

  render() {
    const { item, mode, includeGroups } = this.props;

    // in update mode wait for plan before render edit screen
    if (mode === 'update' && typeof item.getIn(['_id', '$id']) === 'undefined') {
      return (<LoadingItemPlaceholder onClick={this.handleBack} />);
    }

    return (
      <Col lg={12}>
        <Tabs defaultActiveKey={this.state.activeTab} animation={false} id="SettingsTab" onSelect={this.handleSelectTab}>
          <Tab title="Details" eventKey={1}>
            <Panel style={{ borderTop: 'none' }}>
              <PlanTab
                mode={mode}
                onChangeFieldValue={this.onChangeFieldValue}
                onPlanCycleUpdate={this.onPlanCycleUpdate}
                onPlanTariffAdd={this.onPlanTariffAdd}
                onPlanTariffRemove={this.onPlanTariffRemove}
                plan={item}
              />
            </Panel>
          </Tab>

          <Tab title="Override Product Price" eventKey={2}>
            <Panel style={{ borderTop: 'none' }}>
              <PlanProductsPriceTab plan={item} />
            </Panel>
          </Tab>

          <Tab title="Plan Includes" eventKey={3}>
            <Panel style={{ borderTop: 'none' }}>
              <PlanIncludesTab
                addGroup={this.props.onGroupAdd}
                addGroupProducts={this.props.addGroupProducts}
                getGroupProducts={this.props.getGroupProducts}
                includeGroups={includeGroups}
                onChangeFieldValue={this.onChangeFieldValue}
                onRemoveGroup={this.props.onGroupRemove}
                removeGroupProducts={this.props.removeGroupProducts}
              />
            </Panel>
          </Tab>

        </Tabs>
        <div style={{ marginTop: 12 }}>
          <Button onClick={this.handleSave} bsStyle="primary" style={{ marginRight: 10 }} >Save</Button>
          <Button onClick={this.handleBack} bsStyle="default">Cancel</Button>
        </div>
      </Col>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  addGroupProducts,
  getGroupProducts,
  onGroupAdd,
  onGroupRemove,
  removeGroupProducts,
}, dispatch);


const mapStateToProps = (state, props) => {
  const { tab: activeTab } = props.location.query;
  const { itemId, action: mode = (itemId) ? 'update' : 'new' } = props.params;
  const { plan: item } = state;
  const includeGroups = item.getIn(['include', 'groups'], Immutable.Map());
  return { itemId, item, mode, includeGroups, activeTab };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlanSetup));
