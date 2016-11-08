import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Row, Panel, Col } from 'react-bootstrap';
import TotalSubscribersWidget from './Widgets/TotalSubscribers';
import NewSubscribersWidget from './Widgets/NewSubscribers';
import ChurningSubscribersWidget from './Widgets/ChurningSubscribers';
import ReveneWidget from './Widgets/Revene';
import RevenueAvgPerSubscriberWidget from './Widgets/RevenueAvgPerSubscriber';
import SubsPerPlanWidget from './Widgets/SubsPerPlan';
import SubsPerPlanCurrentMonthWidget from './Widgets/SubsPerPlanCurrentMonth';
import RevenuePerPlanWidget from './Widgets/RevenuePerPlan';
import RevenuePerPlanCurrentMonthWidget from './Widgets/RevenuePerPlanCurrentMonth';
// import MapSubscribersWidget from './Widgets/MapSubscribers';
import { getFromDate, getToDate, getMonthName } from './Widgets/helper';


class Dashboard extends Component {

  constructor(props) {
    super(props);
    const toDate = getToDate();
    const fromDate = getFromDate(5, 'months', toDate);
    this.state = { fromDate, toDate };
  }

  render() {
    const { fromDate, toDate } = this.state;
    const currentMonthRange = `${getMonthName(toDate.getUTCMonth() + 1)}, 01 to ${('0' + toDate.getUTCDate()).slice(-2)}`;

    return (
      <Row>
        <Col lg={8} md={12} sm={12} xs={12} lgOffset={2} mdOffset={0} smOffset={0} xsOffset={0} >
          {/*
          <Row>
            <Col lg={12}>
              <Panel header={<span>Demographic Distribution</span>}>
                <MapSubscribersWidget fromDate={fromDate} toDate={toDate}/>
              </Panel>
            </Col>
          </Row>
          */}

          <Row>
            <Col lg={6}>
              <Panel header={<span>Revenue</span>}>
                <ReveneWidget fromDate={fromDate} toDate={toDate} width={565} />
              </Panel>
            </Col>
            <Col lg={6}>
              <Panel header={<span>Revenue Avg. per Subscriber</span>}>
                <RevenueAvgPerSubscriberWidget fromDate={fromDate} toDate={toDate} width={565} />
              </Panel>
            </Col>
          </Row>

          <Row>
            <Col lg={4}>
              <Panel header={<span>Total Subscribers</span>}>
                <TotalSubscribersWidget fromDate={fromDate} toDate={toDate} width={370} />
              </Panel>
            </Col>
            <Col lg={4}>
              <Panel header={<span>New Subscribers</span>}>
                <NewSubscribersWidget fromDate={fromDate} toDate={toDate} width={370} />
              </Panel>
            </Col>
            <Col lg={4}>
              <Panel header={<span>Churning Subscribers</span>}>
                <ChurningSubscribersWidget fromDate={fromDate} toDate={toDate} width={370} />
              </Panel>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Panel header={<span>Subscribers per Plan</span>}>
                <SubsPerPlanWidget fromDate={fromDate} toDate={toDate} width={565} />
              </Panel>
            </Col>
            <Col lg={6}>
              <Panel header={<span>Subscribers per Plan<span className="pull-right">{currentMonthRange}</span></span>}>
                <SubsPerPlanCurrentMonthWidget fromDate={fromDate} toDate={toDate} width={565} />
              </Panel>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Panel header={<span>Revenue per Plan</span>}>
                <RevenuePerPlanWidget fromDate={fromDate} toDate={toDate} width={565} />
              </Panel>
            </Col>
            <Col lg={6}>
              <Panel header={<span>Revenue per Plan<span className="pull-right">{currentMonthRange}</span></span>}>
                <RevenuePerPlanCurrentMonthWidget fromDate={fromDate} toDate={toDate} width={565} />
              </Panel>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  dashboard: state.dashboard
});

export default connect(mapStateToProps)(Dashboard);
