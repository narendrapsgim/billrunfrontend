import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';

import { getPlan,
         clearPlan,
         onPlanFieldUpdate,
         addUsagetInclude } from '../../actions/planActions';
import { showWarning } from '../../actions/alertsActions';

import { Col, Tabs, Tab, Panel } from 'react-bootstrap';
import ChargingPlanDetails from './ChargingPlanDetails';
import ChargingPlanIncludes from './ChargingPlanIncludes';

class ChargingPlanSetup extends React.Component {
  static defaultProps = {
    plan: Immutable.Map()
  };

  static propTypes = {
    plan: React.PropTypes.instanceOf(Immutable.Map),
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired
    }).isRequired
  };
  
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { planId } = this.props.location.query;
    if (planId) this.props.dispatch(getPlan(planId));
  }

  componentWillUnmount() {
    this.props.dispatch(clearPlan());
  }

  onChangeField = (e) => {
    const { id, value } = e.target;
    this.props.dispatch(onPlanFieldUpdate([id], value));
  };

  onSelectUsaget = (usaget) => {
    const { plan, dispatch } = this.props;
    if (plan.getIn(['include', usaget])) {
      dispatch(showWarning("Usage type already defined"));
      return;
    }
    dispatch(addUsagetInclude(usaget));
  };

  onUpdateIncludeField = (usaget, id, value) => {
    this.props.dispatch(onPlanFieldUpdate(['include', usaget, id], value));
  };
  
  render() {
    const { plan } = this.props;
    const { action } = this.props.location.query;

    return (
      <div className="ChargingPlanSetup">
        <Col lg={12} md={12}>
          <Tabs defaultActiveKey={1}
                id="ChargingPlan"
                animation={false}>
            <Tab title="Details" eventKey={1}>
              <Panel style={{  borderTop: 'none' }}>
                <ChargingPlanDetails
                    plan={ plan }
                    action={ action }
                    onChangeField={ this.onChangeField }
                />
              </Panel>
            </Tab>
            <Tab title="Cards" eventKey={2}>
              <Panel style={{  borderTop: 'none' }}>
                Cards
              </Panel>
            </Tab>
            <Tab title="Include" eventKey={3}>
              <Panel style={{  borderTop: 'none' }}>
                <ChargingPlanIncludes
                    includes={ plan.get('include', Immutable.Map()) }
                    onSelectUsaget={ this.onSelectUsaget }
                    onUpdateField={ this.onUpdateIncludeField }
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
     plan: state.plan
  };
}

export default withRouter(connect(mapStateToProps)(ChargingPlanSetup));
