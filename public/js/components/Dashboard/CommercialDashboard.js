import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';
import DashboardBase from './DashboardBase';


const CommercialDashboard = ({ fromDate, toDate, currency }) => (
  <Row>
    <Col lg={6}>
      <p>&nbsp;</p>
    </Col>
  </Row>
);

CommercialDashboard.propTypes = {
  fromDate: PropTypes.instanceOf(moment),
  toDate: PropTypes.instanceOf(moment),
};

export default DashboardBase(CommercialDashboard);
