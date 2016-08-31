import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { Panel, Col} from 'react-bootstrap';

import { getData } from '../../actions/dashboardActions';
import TotalSubscribersWidget from './Widgets/TotalSubscribers';
import NewSubscribersWidget from './Widgets/NewSubscribers';
import ChurningSubscribersWidget from './Widgets/ChurningSubscribers';
import ReveneWidget from './Widgets/Revene';
import RevenueAvgPerSubscriberWidget from './Widgets/RevenueAvgPerSubscriber';
import SubsPerPlanWidget from './Widgets/SubsPerPlan';
import SubsPerPlanCurrentMonthWidget from './Widgets/SubsPerPlanCurrentMonth';
import RevenuePerPlanWidget from './Widgets/RevenuePerPlan';
import RevenuePerPlanCurrentMonthWidget from './Widgets/RevenuePerPlanCurrentMonth';
import MapSubscribersWidget from './Widgets/MapSubscribers';
import {getFromDate, getToDate} from './Widgets/helper';


class Dashboard extends Component {

  constructor(props) {
    super(props);
    let today = new Date();
    let fromDate = new Date(moment(today).add(-5,'months').startOf('month').startOf('hour').startOf('minute').startOf('second'));
    this.state = {
      fromDate: fromDate,
      toDate: today,
    }
  }

  render() {
    const {fromDate, toDate} = this.state;

    return (
      <div>
        <Col lg={12}>
          <Panel header="Demographic Distribution">
            <MapSubscribersWidget fromDate={fromDate} toDate={toDate}/>
          </Panel>
        </Col>
        <Col lg={6}>
          <Panel header="Revenue">
            <ReveneWidget fromDate={fromDate} toDate={toDate} width={565}/>
          </Panel>
        </Col>
        <Col lg={6}>
          <Panel header="Revenue Avg. per Subscriber">
            <RevenueAvgPerSubscriberWidget fromDate={fromDate} toDate={toDate} width={565}/>
          </Panel>
        </Col>
        <Col lg={4}>
          <Panel header="Total Subscribers">
          <TotalSubscribersWidget fromDate={fromDate} toDate={toDate} width={370}/>
        </Panel>
        </Col>
        <Col lg={4}>
          <Panel header="New Subscribers">
            <NewSubscribersWidget fromDate={fromDate} toDate={toDate} width={370}/>
          </Panel>
        </Col>
        <Col lg={4}>
          <Panel header="Churning Subscribers">
            <ChurningSubscribersWidget fromDate={fromDate} toDate={toDate} width={370}/>
          </Panel>
        </Col>
        <Col lg={6}>
          <Panel header="Subscribers per Plan">
            <SubsPerPlanWidget fromDate={fromDate} toDate={toDate} width={565}/>
          </Panel>
        </Col>
        <Col lg={6}>
          <Panel header="Subscribers per Plan">
            <SubsPerPlanCurrentMonthWidget fromDate={fromDate} toDate={toDate} width={565}/>
          </Panel>
        </Col>
        <Col lg={6}>
          <Panel header="Revenue per Plan">
            <RevenuePerPlanWidget fromDate={fromDate} toDate={toDate} width={565}/>
          </Panel>
        </Col>
        <Col lg={6}>
          <Panel header="Revenue per Plan">
            <RevenuePerPlanCurrentMonthWidget fromDate={fromDate} toDate={toDate} width={565}/>
          </Panel>
        </Col>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    dashboard: state.dashboard
  };
}

export default connect(mapStateToProps)(Dashboard);
