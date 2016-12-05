import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { Col, Panel, Tabs, Tab, Button } from 'react-bootstrap';
import Immutable from 'immutable';
import PlanTab from './PlanTab';
import PlanProductsPriceTab from './PlanProductsPriceTab';
import PlanIncludesTab from './PlanIncludesTab';
import LoadingItemPlaceholder from '../Elements/LoadingItemPlaceholder';
/* ACTIONS */
import {
  clearPlan,
  getPlan,
  savePlan,
  onGroupAdd,
  onGroupRemove,
  onPlanCycleUpdate,
  onPlanTariffAdd,
  onPlanTariffRemove,
  onPlanFieldUpdate } from '../../actions/planActions';
import { addGroupProducts, getGroupProducts, removeGroupProducts } from '../../actions/planGroupsActions';
import { savePlanRates } from '../../actions/planProductsActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import { showDanger } from '../../actions/alertsActions';


class PlanSetup extends Component {

  static defaultProps = {
    item: Immutable.Map(),
    activeTab: 1,
  };

  static propTypes = {
    itemId: React.PropTypes.string,
    item: React.PropTypes.instanceOf(Immutable.Map),
    includeGroups: React.PropTypes.instanceOf(Immutable.Map),
    mode: React.PropTypes.string,
    activeTab: React.PropTypes.number,
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired,
    }).isRequired,
    addGroupProducts: React.PropTypes.func.isRequired,
    clearPlan: React.PropTypes.func.isRequired,
    getGroupProducts: React.PropTypes.func.isRequired,
    getPlan: React.PropTypes.func.isRequired,
    onGroupAdd: React.PropTypes.func.isRequired,
    onGroupRemove: React.PropTypes.func.isRequired,
    onPlanCycleUpdate: React.PropTypes.func.isRequired,
    onPlanFieldUpdate: React.PropTypes.func.isRequired,
    onPlanTariffAdd: React.PropTypes.func.isRequired,
    onPlanTariffRemove: React.PropTypes.func.isRequired,
    removeGroupProducts: React.PropTypes.func.isRequired,
    savePlan: React.PropTypes.func.isRequired,
    savePlanRates: React.PropTypes.func.isRequired,
    setPageTitle: React.PropTypes.func.isRequired,
    showDanger: React.PropTypes.func.isRequired,
  }

  state = {
    activeTab: parseInt(this.props.activeTab, 10),
  }

  componentWillMount() {
    const { itemId } = this.props;
    if (itemId) {
      this.props.getPlan(itemId);
    }
  }

  componentDidMount() {
    const { mode } = this.props;
    if (mode === 'new') {
      this.props.setPageTitle('Create New Plan');
      this.props.dispatch(onPlanFieldUpdate(['connection_type'], 'postpaid'));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { item: oldItem, mode } = this.props;
    const { item } = nextProps;
    if (mode === 'update' && oldItem.get('name') !== item.get('name')) {
      this.props.setPageTitle(`Edit plan - ${item.get('name')}`);
    }
  }

  componentWillUnmount() {
    this.props.clearPlan();
  }

  onChangeFieldValue = (path, value) => {
    this.props.onPlanFieldUpdate(path, value);
  }

  onPlanCycleUpdate = (index, value) => {
    this.props.onPlanCycleUpdate(index, value);
  }

  onPlanTariffAdd = (trail) => {
    this.props.onPlanTariffAdd(trail);
  }

  onPlanTariffRemove = (index) => {
    this.props.onPlanTariffRemove(index);
  }

  handleSave = () => {
    this.saveRates();
  }

  saveRates = () => {
    this.props.savePlanRates(this.savePlan);
  }

  savePlan = () => {
    const { item, mode } = this.props;
    this.props.savePlan(item, mode, this.afterSave);
  }

  afterSave = (data) => {
    console.log("data : ", data);
    if (typeof data.error !== 'undefined' && data.error.length) {
      this.handleResponseError(data);
    } else {
      this.props.router.push('/plans');
    }
  }

  handleBack = () => {
    this.props.router.push('/plans');
  }

  handleSelectTab = (key) => {
    this.setState({ activeTab: key });
  }

  handleResponseError = (response) => {
    let errorMessage = 'Error, please try again...';
    try {
      errorMessage = response.error[0].error.data.message;
    } catch (e1) {
      try {
        errorMessage = response.error[0].error.message;
      } catch (e2) {
        console.log('unknown error response: ', response);
      }
    }
    this.props.showDanger(errorMessage);
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
              <PlanProductsPriceTab />
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
  clearPlan,
  getGroupProducts,
  getPlan,
  onGroupAdd,
  onGroupRemove,
  onPlanCycleUpdate,
  onPlanFieldUpdate,
  onPlanTariffAdd,
  onPlanTariffRemove,
  removeGroupProducts,
  savePlan,
  savePlanRates,
  setPageTitle,
  showDanger,
}, dispatch);


const mapStateToProps = (state, props) => {
  const { tab: activeTab } = props.location.query;
  const { itemId, action: mode = (itemId) ? 'update' : 'new' } = props.params;
  const { plan: item } = state;
  const includeGroups = item.getIn(['include', 'groups'], Immutable.Map());
  return { itemId, item, mode, includeGroups, activeTab };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlanSetup));
