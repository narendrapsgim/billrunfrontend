import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPlan } from '../../actions/planActions';

import { Tabs, Tab, Col, Panel } from 'react-bootstrap';
import PrepaidPlanDetails from './PrepaidPlanDetails';
import PlanNotifications from './PlanNotifications';

class PrepaidPlan extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { planId } = this.props.location.query;
    if (planId) this.props.dispatch(getPlan(planId));
  }

  render() {
    const { plan } = this.props;
    const { action } = this.props.location.query;

    return (
      <div>

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
		Override Product Price
	      </Panel>
	    </Tab>

	    <Tab title="Notification" eventKey={3}>
	      <Panel style={{borderTop: 'none'}}>
		<PlanNotifications plan={plan} />
	      </Panel>
	    </Tab>

	    <Tab title="Block Products" eventKey={4}>
	      <Panel style={{borderTop: 'none'}}>
		Block Products
	      </Panel>
	    </Tab>

	    <Tab title="Thresholds" eventKey={5}>
	      <Panel style={{borderTop: 'none'}}>
		Thresholds
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
    plan: state.plan
  };
}

export default connect(mapStateToProps)(PrepaidPlan);
