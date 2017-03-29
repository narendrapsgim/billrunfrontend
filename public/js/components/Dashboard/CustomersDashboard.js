import React, { PropTypes } from 'react';
import { Row, Panel, Col } from 'react-bootstrap';
import moment from 'moment';
import DashboardBase from './DashboardBase';


const CustomersDashboard = ({ fromDate, toDate }) => (
  <Row>
    <Col lg={6}>
      <p>CustomersDashboard</p>
    </Col>
  </Row>
);

CustomersDashboard.propTypes = {
  fromDate: PropTypes.instanceOf(moment),
  toDate: PropTypes.instanceOf(moment),
};

export default DashboardBase(CustomersDashboard);
