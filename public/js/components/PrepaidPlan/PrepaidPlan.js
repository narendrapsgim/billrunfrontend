import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPlan } from '../../actions/planActions';
import { List } from 'immutable';
import moment from 'moment';

import { addNotification,
	 removeNotification,
	 updateNotificationField,
	 addBalanceNotifications,
	 removeBalanceNotifications,
	 blockProduct,
	 removeBlockProduct,
	 addBalanceThreshold,
	 changeBalanceThreshold } from '../../actions/prepaidPlanActions';
import { getList } from '../../actions/listActions';
import { showWarning } from '../../actions/alertsActions';

import { Tabs, Tab, Col, Panel } from 'react-bootstrap';
import PrepaidPlanDetails from './PrepaidPlanDetails';
import PlanNotifications from './PlanNotifications';
import BlockedProducts from './BlockedProducts';
import PlanProductsPriceTab from '../Plan/PlanProductsPriceTab';
import Thresholds from './Thresholds';

class PrepaidPlan extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { planId } = this.props.location.query;
    if (planId) this.props.dispatch(getPlan(planId));
    const ppincludes_params = {
      api: "find",
      params: [
	{ collection: "prepaidincludes" },
	{ query: JSON.stringify({to: {"$gt": moment()}}) }
      ]
    };
    this.props.dispatch(getList('pp_includes', ppincludes_params));
  }

  onSelectBalance = (pp_include) => {
    const { plan, dispatch } = this.props;    
    if (plan.getIn(['notifications_threshold', pp_include], List()).size) {
      dispatch(showWarning(`There are already notifications for selected balance`));
      return;
    }   
    dispatch(addBalanceNotifications(pp_include));
  };
  
  onAddNotification = (threshold_id) => {
    this.props.dispatch(addNotification(threshold_id));
  };

  onRemoveNotification = (threshold_id, index) => {
    this.props.dispatch(removeNotification(threshold_id, index));
  };

  onUpdateNotificationField = (threshold_id, index, field, value) => {
    this.props.dispatch(updateNotificationField(threshold_id, index, field, value));
  };

  onRemoveBalanceNotifications = (balance_id) => {
    this.props.dispatch(removeBalanceNotifications(balance_id));
  };

  onSelectBlockProduct = (rate_key) => {
    const { plan, dispatch } = this.props;
    if (plan.get('disallowed_rates', List()).includes(rate_key)) {
      dispatch(showWarning(`${rate_key} already blocked`));
      return;
    }
    dispatch(blockProduct(rate_key));
  };

  onRemoveBlockProduct = (rate_key) => {
    this.props.dispatch(removeBlockProduct(rate_key));
  };
  
  onChangeThreshold = (balance_id, threshold) => {
    this.props.dispatch(changeBalanceThreshold(balance_id, threshold));
  };

  onAddBalanceThreshold = (balance_id) => {
    const { plan, dispatch } = this.props;
    if (plan.getIn(['pp_threshold', balance_id])) {
      dispatch(showWarning("Balance already defined"));
      return;
    }
    dispatch(addBalanceThreshold(balance_id))
  };
  
  render() {
    const { plan, pp_includes } = this.props;
    const { action } = this.props.location.query;

    return (
      <div className="PrepaidPlan">
	<Col lg={12}>
	  <Tabs defaultActiveKey={1}
		id="PrepaidPlan"
		animation={false}
		onSelect={this.handleSelectTab}>

	    <Tab title="Details" eventKey={1}>
 	      <Panel style={{borderTop: 'none'}}>
		<PrepaidPlanDetails plan={plan} action={action} />
	      </Panel>
	    </Tab>

	    <Tab title="Override Product Price" eventKey={2}>
	      <Panel style={{borderTop: 'none'}}>
		<PlanProductsPriceTab />
	      </Panel>
	    </Tab>

	    <Tab title="Notification" eventKey={3}>
	      <Panel style={{borderTop: 'none'}}>
		<PlanNotifications plan={ plan }
				   pp_includes={ pp_includes }
				   onAddNotification={ this.onAddNotification }
				   onRemoveNotification={ this.onRemoveNotification }
				   onUpdateNotificationField={ this.onUpdateNotificationField }
				   onSelectBalance={ this.onSelectBalance }
				   onRemoveBalanceNotifications={ this.onRemoveBalanceNotifications }
		/>
	      </Panel>
	    </Tab>

	    <Tab title="Blocked Products" eventKey={4}>
	      <Panel style={{borderTop: 'none'}}>
		<BlockedProducts plan={ plan }
				 onSelectProduct={ this.onSelectBlockProduct }
				 onRemoveProduct={ this.onRemoveBlockProduct }
		/>
	      </Panel>
	    </Tab>

	    <Tab title="Thresholds" eventKey={5}>
	      <Panel style={{borderTop: 'none'}}>
		<Thresholds plan={ plan }
			    pp_includes={ pp_includes }
			    onChangeThreshold={ this.onChangeThreshold }
			    onAddBalance={ this.onAddBalanceThreshold }
		/>
	      </Panel>
	    </Tab>
	  </Tabs>
	</Col>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    plan: state.plan,
    pp_includes: state.list.get('pp_includes', List())
  };
}

export default connect(mapStateToProps)(PrepaidPlan);
