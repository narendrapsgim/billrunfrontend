import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { Row, Col, Panel, Tabs, Tab, Button } from 'react-bootstrap';
import Immutable from 'immutable';

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
import {
  addGroupProducts,
  getGroupProducts,
  removeGroupProducts } from '../../actions/planGroupsActions';
import { savePlanRates } from '../../actions/planProductsActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';

import PlanTab from './PlanTab';
import PlanProductsPriceTab from './PlanProductsPriceTab';
import PlanIncludesTab from './PlanIncludesTab';

class PlanSetup extends Component {

  static defaultProps = {
    plan: Immutable.Map(),
  };

  static propTypes = {
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired
    }).isRequired
  }

  state = {
    activeTab : parseInt(this.props.location.query.tab) || 1
  }

  componentWillMount() {
    let { planId } = this.props.location.query;
    if (planId) {
      this.props.getPlan(planId);
    }
  }

  componentDidMount() {
    const { action } = this.props.location.query;
    if (action !== 'update') {
      this.props.setPageTitle('Create New Plan');
    }
  }

  componentWillReceiveProps(nextProps) {
    const { action } = this.props.location.query;
    const { plan } = nextProps;
    const { plan: oldItem } = this.props;
    if (action === 'update' && oldItem.get('name') !== plan.get('name')) {
      this.props.setPageTitle(`Edit plan - ${plan.get('name')}`);
    }
  }

  componentWillUnmount() {
    this.props.clearPlan();
  }

  onChangeFieldValue = (path, value) => {
    this.props.onPlanFieldUpdate(path, value)
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
    const { plan } = this.props;
    const { action } = this.props.location.query;
    this.props.savePlan(plan, action, this.afterSave);
  }

  afterSave = (data) => {
    if(typeof data.error !== 'undefined' && data.error.length){
      console.log("error on save : ", data);
    } else {
      this.props.router.push('/plans');
    }
  }

  handleBack = () => {
    this.props.router.push('/plans');
  }

  handleSelectTab = (key) => {
    this.setState({activeTab:key});
  }

  render() {
    const { plan } = this.props;
    const { action } = this.props.location.query;

    //in update mode wait for plan before render edit screen
    if(action === 'update' && typeof plan.getIn(['_id', '$id']) === 'undefined'){
      return <div>Loading...</div>
    }

    const planName = plan.get('name', '');
    const includeGroups =  plan.getIn(['include', 'groups'], Immutable.Map());

    return (
      <Col lg={12}>
        <Tabs defaultActiveKey={this.state.activeTab} animation={false} id="SettingsTab" onSelect={this.handleSelectTab}>
          <Tab title="Details" eventKey={1}>
            <Panel style={{borderTop: 'none'}}>
              <PlanTab plan={plan} mode={action}
                onChangeFieldValue={this.onChangeFieldValue}
                onPlanCycleUpdate={this.onPlanCycleUpdate}
                onPlanTariffAdd={this.onPlanTariffAdd}
                onPlanTariffRemove={this.onPlanTariffRemove}
              />
            </Panel>
          </Tab>

          <Tab title="Override Product Price" eventKey={2}>
            <Panel style={{borderTop: 'none'}}>
              <PlanProductsPriceTab />
            </Panel>
          </Tab>

          <Tab title="Plan Includes" eventKey={3}>
            <Panel style={{borderTop: 'none'}}>
              <PlanIncludesTab
                  includeGroups={includeGroups}
                  onChangeFieldValue={this.onChangeFieldValue}
                  onRemoveGroup={this.props.onGroupRemove}
                  addGroup={this.props.onGroupAdd}
                  addGroupProducts={this.props.addGroupProducts}
                  getGroupProducts={this.props.getGroupProducts}
                  removeGroupProducts={this.props.removeGroupProducts}
              />
            </Panel>
          </Tab>

        </Tabs>
        <div style={{marginTop: 12}}>
          <Button onClick={this.handleSave} bsStyle="primary" style={{marginRight: 10}}>Save</Button>
          <Button onClick={this.handleBack} bsStyle="default">Cancel</Button>
        </div>
      </Col>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getGroupProducts,
    addGroupProducts,
    removeGroupProducts,
    onGroupAdd,
    onGroupRemove,
    onPlanCycleUpdate,
    onPlanTariffAdd,
    onPlanTariffRemove,
    onPlanFieldUpdate,
    getPlan,
    clearPlan,
    setPageTitle,
    savePlan,
    savePlanRates }, dispatch);
}
function mapStateToProps(state, props) {
  return  {
    plan: state.plan,
  };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlanSetup));
