import React, { PropTypes } from 'react';
import { Row, Panel, Col } from 'react-bootstrap';
import DashboardBase from './DashboardBase';
import {
  TotalRevenue,
  OutstandingDebt,
  TotalCustomers,
  CustomerStateDistribution,
} from './Widgets';


const OverviewDashboard = ({ currency }) => (
  <Row>
    <Col sm={6} lg={3}>
      <Panel header="Total Revenue">
        <div className="dashboard-chart-wrapper">
          <TotalRevenue currency={currency} />
        </div>
      </Panel>
    </Col>
    <Col sm={6} lg={3}>
      <Panel header="Outstanding Debt">
        <div className="dashboard-chart-wrapper">
          <OutstandingDebt currency={currency} />
        </div>
      </Panel>
    </Col>
    <Col sm={6} lg={3}>
      <Panel header="Total number of Subscribers">
        <div className="dashboard-chart-wrapper">
          <TotalCustomers />
        </div>
      </Panel>
    </Col>
    <Col sm={6} lg={3}>
      <Panel header="Subscribers State Distribution">
        <div className="dashboard-chart-wrapper">
          <CustomerStateDistribution />
        </div>
      </Panel>
    </Col>
  </Row>
);

OverviewDashboard.defaultProps = {
  currency: 'USD',
};

OverviewDashboard.propTypes = {
  currency: PropTypes.string,
};

export default DashboardBase(OverviewDashboard);
