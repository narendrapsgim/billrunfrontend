import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Row, Col, Panel, Tabs, Tab, Button } from 'react-bootstrap';

import { updatePlanField,
  updatePlanRecurringPriceField,
  getPlan,
  clearPlan,
  savePlan,
  addTariff,
  removeRecurringPrice } from '../../actions/planActions';
import { getInputProcessors } from '../../actions/inputProcessorActions';
import { savePlanRates } from '../../actions/planProductsActions';

import Plan from './Plan';
import PlanProductsPriceTab from './PlanProductsPriceTab';
import PlanIncludesTab from './PlanIncludesTab';

class PlanSetup extends Component {
  constructor(props) {
    super(props);
    this.onChangeFieldValue = this.onChangeFieldValue.bind(this);
    this.handleBack = this.handleBack.bind(this);

    this.onAddTariff = this.onAddTariff.bind(this);
    this.onChangeRecurringPriceFieldValue = this.onChangeRecurringPriceFieldValue.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.onChangeDateFieldValue = this.onChangeDateFieldValue.bind(this);
    this.onRemoveRecurringPrice = this.onRemoveRecurringPrice.bind(this);

    this.state = {
      stepIndex: 0,
      finished: 0
    };
  }

  componentWillMount() {
    let { plan_id } = this.props.location.query;
    if (plan_id) {
      this.props.dispatch(getPlan(plan_id));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearPlan());
  }

  onChangeFieldValue(e) {
    const { value, id, checked, type } = e.target;
    const { dispatch } = this.props;
    type === "checkbox" ?
                         dispatch(updatePlanField(id, checked)) :
                         dispatch(updatePlanField(id, value));
  }

  onChangeRecurringPriceFieldValue(id, idx, e, val) {
    let value = val ? val : e.target.value;
    const { checked, type } = e.target;
    const { dispatch } = this.props;
    type === "checkbox" ?
                         dispatch(updatePlanRecurringPriceField(id, idx, checked)) :
                         dispatch(updatePlanRecurringPriceField(id, idx, value));
  }

  onAddTariff(e) {
    e.preventDefault();
    this.props.dispatch(addTariff());
  }

  onRemoveRecurringPrice(idx, e) {
    this.props.dispatch(removeRecurringPrice(idx));
  }

  onChangeDateFieldValue(id, value) {
    this.props.dispatch(updatePlanField(id, value));
  }

  handleSave() {
    const { plan, dispatch } = this.props;
    const { action } = this.props.location.query;
    dispatch(savePlan(this.props.plan, action));
    this.props.dispatch(savePlanRates());
    //browserHistory.goBack();
  }

  handleBack() {
    browserHistory.goBack();
  }

  render() {
    const { plan, validator } = this.props;
    const { action } = this.props.location.query;
    const planName = plan.get('PlanName');
    //in update mode wait for plan before render edit screen
    if(action === 'update' && typeof plan.get('id') === 'undefined'){
      return <div>Loading...</div>
    }

    return (
      <Col lg={12}>
        <Tabs defaultActiveKey={1} animation={false} id="SettingsTab" onSelect={this.onSelectTab}>
          <Tab title="Billing Plan" eventKey={1}>
            <Panel header={'Basic Settings'}>
              <Plan onChangeFieldValue={this.onChangeFieldValue} onChangeDateFieldValue={this.onChangeDateFieldValue} onChangeRecurringPriceFieldValue={this.onChangeRecurringPriceFieldValue} onAddTariff={this.onAddTariff} onRemoveRecurringPrice={this.onRemoveRecurringPrice} validator={validator} plan={plan} mode={action}/>
            </Panel>
          </Tab>
          {/*
          <Tab title="Override Product Price" eventKey={2}>
            <Panel header={ (planName === '') ? 'Override Products Price' : `Override Products Price for plan "${planName}"`}>
              <PlanProductsPriceTab planName={planName}/>
            </Panel>
          </Tab>
          <Tab title="Plan Includes" eventKey={3}>
            <Panel header={ (planName === '') ? 'Set Plan Include Groups' : `Edit Plan "${planName}" Group Includes`}>
              <PlanIncludesTab plan={plan} onChangeFieldValue={this.onChangeFieldValue} onIncludeRemove={this.onIncludeRemove} />
            </Panel>
          </Tab>
          */}
        </Tabs>
        <div style={{marginTop: 12, float: "right"}}>
          <Button onClick={this.handleBack} bsStyle="link" style={{marginRight: 12}} >Cancel</Button>
          <Button onClick={this.handleSave} bsStyle="primary">Save</Button>
        </div>
      </Col>
    );
  }
}

function mapStateToProps(state, props) {
  return  {
    plan: state.plan,
    validator: state.validator
  };
}

export default connect(mapStateToProps)(PlanSetup);
