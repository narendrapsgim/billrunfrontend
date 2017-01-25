import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Col, Tabs, Tab, Panel, Button } from 'react-bootstrap';
import Immutable from 'immutable';
import ChargingPlanDetails from './ChargingPlanDetails';
import ChargingPlanIncludes from './ChargingPlanIncludes';
import { getPrepaidIncludesQuery } from '../../common/ApiQueries';
import {
  getPlan,
  clearPlan,
  savePlan,
  onPlanFieldUpdate,
  addUsagetInclude,
} from '../../actions/planActions';
import { getList } from '../../actions/listActions';
import { showWarning } from '../../actions/alertsActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';


class ChargingPlanSetup extends Component {
  static defaultProps = {
    plan: Immutable.Map(),
    prepaidIncludes: Immutable.List(),
  };

  static propTypes = {
    planId: PropTypes.string,
    action: PropTypes.string,
    plan: PropTypes.instanceOf(Immutable.Map),
    prepaidIncludes: PropTypes.instanceOf(Immutable.List),
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { planId } = this.props;
    if (planId) {
      this.props.dispatch(getPlan(planId));
    }
  }

  componentDidMount() {
    const { action } = this.props;
    if (action === 'new') {
      this.props.dispatch(setPageTitle('Create New Buckets Group'));
      this.props.dispatch(onPlanFieldUpdate(['connection_type'], 'prepaid'));
      this.props.dispatch(onPlanFieldUpdate(['charging_type'], 'prepaid'));
      this.props.dispatch(onPlanFieldUpdate(['type'], 'charging'));
      this.props.dispatch(onPlanFieldUpdate(['price'], 0));
      this.props.dispatch(onPlanFieldUpdate(['upfront'], true));
      this.props.dispatch(onPlanFieldUpdate(['recurrence'], Immutable.Map({ unit: 1, periodicity: 'month' })));
    }
    this.props.dispatch(getList('prepaid_includes', getPrepaidIncludesQuery()));
  }

  componentWillReceiveProps(nextProps) {
    const { plan } = nextProps;
    const { plan: oldPlan, action } = this.props;
    if (action !== 'new' && plan.get('name') && oldPlan.get('name', '') !== plan.get('name', '')) {
      this.props.dispatch(setPageTitle(`Edit Buckets Group - ${plan.get('name')}`));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearPlan());
  }

  onChangeField = (path, value) => {
    this.props.dispatch(onPlanFieldUpdate(path, value));
  };

  onSelectPPInclude = (value) => {
    const { prepaidIncludes } = this.props;
    const ppInclude = prepaidIncludes.find(pp => pp.get('name') === value);
    const usaget = ppInclude.get('charging_by_usaget');
    if (this.props.plan.getIn(['include', usaget])) {
      this.props.dispatch(showWarning('Prepaid bucket already defined'));
    } else {
      const ppIncludesName = ppInclude.get('name');
      const ppIncludesExternalId = ppInclude.get('external_id');
      this.props.dispatch(addUsagetInclude(usaget, ppIncludesName, ppIncludesExternalId));
    }
  };

  onUpdatePeriodField = (type, id, value) => {
    this.props.dispatch(onPlanFieldUpdate(['include', type, 'period', id], value));
  };

  onUpdateIncludeField = (usaget, id, value) => {
    this.props.dispatch(onPlanFieldUpdate(['include', usaget, id], value));
  };

  handleBack = () => {
    this.props.router.push('/charging_plans');
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

  render() {
    const { plan, prepaidIncludes, action } = this.props;
    const prepaidIncludesOptions = prepaidIncludes.map(pp => ({
      label: pp.get('name'),
      value: pp.get('name'),
    })).toJS();

    return (
      <div className="ChargingPlanSetup">
        <Col lg={12} md={12}>
          <Tabs defaultActiveKey={1} id="ChargingPlan" animation={false}>

            <Tab title="Details" eventKey={1}>
              <Panel style={{ borderTop: 'none' }}>
                <ChargingPlanDetails
                  item={plan}
                  mode={action}
                  onChangeField={this.onChangeField}
                />
              </Panel>
            </Tab>

            <Tab title="Prepaid Buckets" eventKey={2}>
              <Panel style={{ borderTop: 'none' }}>
                <ChargingPlanIncludes
                  includes={plan.get('include', Immutable.Map())}
                  prepaid_includes_options={prepaidIncludesOptions}
                  onSelectPPInclude={this.onSelectPPInclude}
                  onUpdatePeriodField={this.onUpdatePeriodField}
                  onUpdateField={this.onUpdateIncludeField}
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
  const prepaidIncludes = state.list.get('prepaid_includes');
  return { action, planId, plan, prepaidIncludes };
};

export default withRouter(connect(mapStateToProps)(ChargingPlanSetup));
