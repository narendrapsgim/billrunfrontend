import React, { Component, PropTypes } from 'react';
import { Row, Panel, Col } from 'react-bootstrap';
import DashboardBase from './DashboardBase';
import {
  TotalRevenue,
  OutstandingDebt,
  TotalCustomers,
  CustomerStateDistribution,
} from './Widgets';


class OverviewDashboard extends Component {

  static propTypes = {
    currency: PropTypes.string,
  };

  static defaultProps = {
    currency: 'USD',
  }

  render() {
    const { currency } = this.props;
    return (
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
          <Panel header="Total number of Customers">
            <div className="dashboard-chart-wrapper">
              <TotalCustomers />
            </div>
          </Panel>
        </Col>
        <Col sm={6} lg={3}>
          <Panel header="Customer State Distribution">
            <div className="dashboard-chart-wrapper">
              <CustomerStateDistribution />
            </div>
          </Panel>
        </Col>
      </Row>
    );
  }
}


export default DashboardBase(OverviewDashboard);
