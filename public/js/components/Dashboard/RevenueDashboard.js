import React, { PropTypes } from 'react';
import { Row, Panel, Col } from 'react-bootstrap';
import DashboardBase from './DashboardBase';
import {
  TotalRevenue,
  RevenueOverTime,
  RevenueByPlan,
  AgingDebt,
  OutstandingDebt,
  DebtOverTime,
} from './Widgets';


const RevenueDashboard = ({ currency }) => (
  <Row>
    <Col sm={5} lg={3}>
      <Panel header="Total Revenue">
        <div className="dashboard-chart-wrapper">
          <TotalRevenue currency={currency} />
        </div>
      </Panel>
    </Col>
    <Col sm={7} lg={9}>
      <Panel header="Revenue over time">
        <div className="dashboard-chart-wrapper">
          <RevenueOverTime currency={currency} />
        </div>
      </Panel>
    </Col>
    <Col sm={5} lg={3}>
      <Panel header="Revenue by Plan">
        <div className="dashboard-chart-wrapper">
          <RevenueByPlan currency={currency} />
        </div>
      </Panel>
    </Col>
    <Col sm={7} lg={9}>
      <Panel header="Aging Debt">
        <div className="dashboard-chart-wrapper">
          <AgingDebt currency={currency} />
        </div>
      </Panel>
    </Col>
    <Col sm={5} lg={3}>
      <Panel header="Outstanding Debt">
        <div className="dashboard-chart-wrapper">
          <OutstandingDebt currency={currency} />
        </div>
      </Panel>
    </Col>
    <Col sm={7} lg={9}>
      <Panel header="Debt over time">
        <div className="dashboard-chart-wrapper">
          <DebtOverTime currency={currency} />
        </div>
      </Panel>
    </Col>
  </Row>
);

RevenueDashboard.defaultProps = {
  currency: 'USD',
};

RevenueDashboard.propTypes = {
  currency: PropTypes.string,
};

export default DashboardBase(RevenueDashboard);
