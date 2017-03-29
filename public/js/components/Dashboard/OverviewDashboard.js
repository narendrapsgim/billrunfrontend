import React, { PropTypes } from 'react';
import { Row, Panel, Col } from 'react-bootstrap';
import moment from 'moment';
import DashboardBase from './DashboardBase';


const OverviewDashboard = ({ fromDate, toDate }) => (
  <Row>
    <Col lg={6}>
      <p>OverviewDashboard</p>
    </Col>
  </Row>
);

OverviewDashboard.propTypes = {
  fromDate: PropTypes.instanceOf(moment),
  toDate: PropTypes.instanceOf(moment),
};

export default DashboardBase(OverviewDashboard);
