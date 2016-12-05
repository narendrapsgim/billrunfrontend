import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';

import { getPlan,
         clearPlan,
         savePlan,
         onPlanFieldUpdate,
         addUsagetInclude } from '../../actions/planActions';
import { getList } from '../../actions/listActions';
import { showWarning, showDanger } from '../../actions/alertsActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import { savePlanRates } from '../../actions/planProductsActions';

import { Col, Tabs, Tab, Panel, Button } from 'react-bootstrap';
import ChargingPlanDetails from './ChargingPlanDetails';
import ChargingPlanIncludes from './ChargingPlanIncludes';

class ChargingPlanSetup extends React.Component {
  static defaultProps = {
    plan: Immutable.Map(),
    prepaid_includes: Immutable.List()
  };

  static propTypes = {
    plan: React.PropTypes.instanceOf(Immutable.Map),
    prepaid_includes: React.PropTypes.instanceOf(Immutable.List),
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { planId, action } = this.props.location.query;
    const params = {
      api: 'find',
      params: [
	{ collection: 'prepaidincludes' },
	{ query: JSON.stringify({}) }
      ]
    };
    this.props.dispatch(getList('prepaid_includes', params));
    if (planId) this.props.dispatch(getPlan(planId));
    if (action === 'new') {
      this.props.dispatch(setPageTitle('Create New Charging Plan'));
      this.props.dispatch(onPlanFieldUpdate(['connection_type'], 'prepaid'));
      this.props.dispatch(onPlanFieldUpdate(['charging_type'], 'prepaid'));
      this.props.dispatch(onPlanFieldUpdate(['type'], 'charging'));
      this.props.dispatch(onPlanFieldUpdate(['price'], 0));
      this.props.dispatch(onPlanFieldUpdate(['upfront'], true));
      this.props.dispatch(onPlanFieldUpdate(['recurrence'], Immutable.Map({unit: 1, periodicity: "month"})));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { plan } = nextProps;
    const { action } = this.props.location.query;
    if (action !== 'new' &&
        plan.get('name') &&
        this.props.plan.get('name') !== plan.get('name')) {
      this.props.dispatch(setPageTitle(`Edit Charging Plan - ${plan.get('name')}`));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearPlan());
  }

  onChangeField = (path, value) => {
    this.props.dispatch(onPlanFieldUpdate(path, value));
  };

  onSelectPPInclude = (value) => {
    const pp_include = this.props.prepaid_includes.find(pp => pp.get('name') === value);
    const usaget = pp_include.get('charging_by_usaget');
    if (this.props.plan.getIn(['include', usaget])) {
      this.props.dispatch(showWarning("Prepaid bucket already defined"));
      return;
    }
    const pp_includes_name = pp_include.get('name');
    const pp_includes_external_id = pp_include.get('external_id');
    this.props.dispatch(addUsagetInclude(usaget, pp_includes_name, pp_includes_external_id));
  };
  
  onUpdatePeriodField = (type, id, value) => {
    this.props.dispatch(onPlanFieldUpdate(['include', type, 'period', id], value));
  };

  onUpdateIncludeField = (usaget, id, value) => {
    this.props.dispatch(onPlanFieldUpdate(['include', usaget, id], value));
  };

  handleCancel = () => {
    this.props.router.push('/charging_plans');
  };

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
    this.props.dispatch(showDanger(errorMessage));
  }

  savePlan = () => {
    const { plan, location, dispatch } = this.props;
    const { action } = location.query;
    dispatch(savePlan(plan, action, this.afterSave));
  }

  afterSave = (data) => {
    console.log("data : ", data);
    if (typeof data.error !== 'undefined' && data.error.length) {
      this.handleResponseError(data);
    } else {
      this.props.router.push('/charging_plans');
    }
  }

  handleSave = () => {
    this.props.dispatch(savePlanRates(this.savePlan));
  };

  render() {
    const { plan, prepaid_includes } = this.props;
    const { action } = this.props.location.query;

    const prepaid_includes_options = prepaid_includes.map(pp => {
      return { label: pp.get('name'), value: pp.get('name') };
    }).toJS();

    return (
      <div className="ChargingPlanSetup">
        <Col lg={12} md={12}>
          <Tabs defaultActiveKey={1}
                id="ChargingPlan"
                animation={false}>
            <Tab title="Details" eventKey={1}>
              <Panel style={{  borderTop: 'none' }}>
                <ChargingPlanDetails
                    item={ plan }
                    mode={ action }
                    onChangeField={ this.onChangeField }
                />
              </Panel>
            </Tab>
            <Tab title="Prepaid Buckets" eventKey={2}>
              <Panel style={{  borderTop: 'none' }}>
                <ChargingPlanIncludes
                    includes={ plan.get('include', Immutable.Map()) }
                    prepaid_includes_options={ prepaid_includes_options }
                    onSelectPPInclude={ this.onSelectPPInclude }
                    onUpdatePeriodField={ this.onUpdatePeriodField }
                    onUpdateField={ this.onUpdateIncludeField }
                />
              </Panel>
            </Tab>
          </Tabs>
	  <div style={{ marginTop: 12 }}>
            <Button onClick={ this.handleSave }
		    bsStyle="primary"
		    style={{ marginRight: 10 }}>
	      Save
	    </Button>
            <Button onClick={ this.handleCancel }
		    bsStyle="default">
	      Cancel
	    </Button>
	  </div>
        </Col>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    plan: state.plan,
    prepaid_includes: state.list.get('prepaid_includes', Immutable.List())
  };
}

export default withRouter(connect(mapStateToProps)(ChargingPlanSetup));
