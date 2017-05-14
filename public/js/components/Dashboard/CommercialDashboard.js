import React, { PropTypes } from 'react';
import { Row, Col, Panel } from 'react-bootstrap';
import moment from 'moment';
import DashboardBase from './DashboardBase';
import {
  PlanByCustomers,
} from './Widgets';

const CommercialDashboard = ({ fromDate, toDate, currency }) => (
  <Row>
    <Col sm={5} lg={3}>
      <Panel header="Plan By Subscribers">
        <div className="dashboard-chart-wrapper">
          <PlanByCustomers />
        </div>
      </Panel>
    </Col>
  </Row>
);

CommercialDashboard.propTypes = {
  fromDate: PropTypes.instanceOf(moment),
  toDate: PropTypes.instanceOf(moment),
};

export default DashboardBase(CommercialDashboard);
