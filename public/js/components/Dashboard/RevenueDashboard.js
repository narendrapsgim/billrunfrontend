import React, { PropTypes } from 'react';
import { Row, Panel, Col } from 'react-bootstrap';
import moment from 'moment';
import DashboardBase from './DashboardBase';


const RevenueDashboard = ({ fromDate, toDate }) => (
  <Row>
    <Col lg={6}>
      <p>RevenueDashboard</p>
    </Col>
  </Row>
);

RevenueDashboard.propTypes = {
  fromDate: PropTypes.instanceOf(moment),
  toDate: PropTypes.instanceOf(moment),
};

export default DashboardBase(RevenueDashboard);
