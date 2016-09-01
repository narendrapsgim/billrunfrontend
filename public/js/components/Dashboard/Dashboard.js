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
import {getFromDate, getToDate, getMonthName} from './Widgets/helper';


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
          <Panel header={<span>Demographic Distribution</span>}>
            <MapSubscribersWidget fromDate={fromDate} toDate={toDate}/>
          </Panel>
        </Col>
        <Col lg={6}>
          <Panel header={<span>Revenue</span>}>
            <ReveneWidget fromDate={fromDate} toDate={toDate} width={565}/>
          </Panel>
        </Col>
        <Col lg={6}>
          <Panel header={<span>Revenue Avg. per Subscriber</span>}>
            <RevenueAvgPerSubscriberWidget fromDate={fromDate} toDate={toDate} width={565}/>
          </Panel>
        </Col>
        <Col lg={4}>
          <Panel header={<span>Total Subscribers</span>}>
          <TotalSubscribersWidget fromDate={fromDate} toDate={toDate} width={370}/>
        </Panel>
        </Col>
        <Col lg={4}>
          <Panel header={<span>New Subscribers</span>}>
            <NewSubscribersWidget fromDate={fromDate} toDate={toDate} width={370}/>
          </Panel>
        </Col>
        <Col lg={4}>
          <Panel header={<span>Churning Subscribers</span>}>
            <ChurningSubscribersWidget fromDate={fromDate} toDate={toDate} width={370}/>
          </Panel>
        </Col>
        <Col lg={6}>
          <Panel header={<span>Subscribers per Plan</span>}>
            <SubsPerPlanWidget fromDate={fromDate} toDate={toDate} width={565}/>
          </Panel>
        </Col>
        <Col lg={6}>
          <Panel header={<span>Subscribers per Plan<span className="pull-right">{getMonthName(toDate.getUTCMonth()+1) + ", " + '01 to ' + ("0" + toDate.getUTCDate()).slice(-2)}</span></span>}>
            <SubsPerPlanCurrentMonthWidget fromDate={fromDate} toDate={toDate} width={565}/>
          </Panel>
        </Col>
        <Col lg={6}>
          <Panel header={<span>Revenue per Plan</span>}>
            <RevenuePerPlanWidget fromDate={fromDate} toDate={toDate} width={565}/>
          </Panel>
        </Col>
        <Col lg={6}>
          <Panel header={<span>Revenue per Plan<span className="pull-right">{getMonthName(toDate.getUTCMonth()+1) + ", " + '01 to ' + ("0" + toDate.getUTCDate()).slice(-2)}</span></span>}>
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
